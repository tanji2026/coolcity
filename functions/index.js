"use strict";
const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {defineSecret}=require('firebase-functions/params');
const {initializeApp}=require('firebase-admin/app');
const {getFirestore,FieldValue}=require('firebase-admin/firestore');
initializeApp();
const GEMINI_API_KEY=defineSecret('GEMINI_API_KEY');
const MODEL='gemini-2.5-flash';
const MAX_USER_DAILY=20,MAX_GLOBAL_DAILY=500;
const DAY=()=>new Date().toISOString().slice(0,10);
const systemPrompt='你是「小樹苗」，CoolCity 都市高溫調適與綠蔭改善共創平台的 AI 小幫手。使用繁體中文，語氣自然簡潔。協助使用者操作網站、理解都市高溫、街道綠蔭、氣象資料及一般問題。CoolCity 的綠蔭路線目前僅以北大特區示範，平台服務面向全臺灣。不可編造即時氣溫、路線遮蔭程度、官方審核或現場測量結果。對健康與安全問題提醒使用者尋求專業協助。不要要求或輸出 API Key、密碼或個人精確位置。';
async function takeQuota(uid){
 const db=getFirestore(),day=DAY(),userRef=db.doc(`_aiUsage/${day}/users/${uid}`),globalRef=db.doc(`_aiUsage/${day}`);
 await db.runTransaction(async tx=>{
  const [u,g]=await tx.getAll(userRef,globalRef);
  const used=u.exists?(u.data().count||0):0,all=g.exists?(g.data().count||0):0;
  if(used>=MAX_USER_DAILY||all>=MAX_GLOBAL_DAILY)throw new HttpsError('resource-exhausted','今日 AI 使用額度已達上限');
  tx.set(userRef,{count:FieldValue.increment(1),updatedAt:FieldValue.serverTimestamp()},{merge:true});
  tx.set(globalRef,{count:FieldValue.increment(1),updatedAt:FieldValue.serverTimestamp()},{merge:true});
 });
}
exports.chatWithSeedling=onCall({region:'asia-east1',secrets:[GEMINI_API_KEY],timeoutSeconds:45,memory:'256MiB',maxInstances:3,concurrency:10,invoker:'public',enforceAppCheck:false},async request=>{
 if(!request.auth)throw new HttpsError('unauthenticated','請先登入 CoolCity');
 const message=request.data?.message,history=request.data?.history;
 if(typeof message!=='string'||!message.trim()||message.length>1500)throw new HttpsError('invalid-argument','訊息長度需介於 1 至 1500 字');
 if(history!==undefined&&(!Array.isArray(history)||history.length>10))throw new HttpsError('invalid-argument','對話紀錄格式不正確');
 const safeHistory=(history||[]).map(item=>{if(!item||!['user','model'].includes(item.role)||typeof item.text!=='string'||item.text.length>2000)throw new HttpsError('invalid-argument','對話紀錄格式不正確');return {role:item.role,parts:[{text:item.text}]};});
 await takeQuota(request.auth.uid);
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),32000);
 try{
  const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':GEMINI_API_KEY.value()},body:JSON.stringify({systemInstruction:{parts:[{text:systemPrompt}]},contents:[...safeHistory,{role:'user',parts:[{text:message.trim()}]}],generationConfig:{maxOutputTokens:650,temperature:0.6}}),signal:controller.signal});
  if(!res.ok){console.error('Gemini upstream status',res.status);throw new HttpsError('unavailable','AI 服務暫時無法使用');}
  const payload=await res.json();const answer=(payload.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('').trim();
  if(!answer)throw new HttpsError('unavailable','AI 未產生回覆');return {answer:answer.slice(0,5000)};
 }catch(e){if(e instanceof HttpsError)throw e;console.error('Seedling backend failure',e.name);throw new HttpsError('unavailable','AI 服務暫時無法使用');}finally{clearTimeout(timeout);}
});
