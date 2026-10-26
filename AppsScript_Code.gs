/** CoolCity 小樹苗 Apps Script backend. Deploy as Web App, execute as me, access anyone.
 * Requires Script Properties GEMINI_API_KEY, FIREBASE_WEB_API_KEY.
 * Every chat request must pass Firebase ID token verification and per-user daily quota.
 */
const CFG = Object.freeze({model:'gemini-2.5-flash', maxInput:1200, maxOutput:400, dailyPerUser:20, dailyGlobal:500});
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Chat').setTitle('小樹苗｜CoolCity').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function askSeedling(message, idToken) {
  const uid = verifyFirebase_(idToken);
  const input = String(message||'').trim();
  if (!input || input.length > CFG.maxInput) throw new Error('請輸入 1 至 1200 字的問題。');
  const props = PropertiesService.getScriptProperties();
  const key = props.getProperty('GEMINI_API_KEY');
  if (!key) throw new Error('尚未設定 Gemini API Key。');
  enforceQuota_(uid);
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/'+CFG.model+':generateContent';
  const payload = {
    systemInstruction:{parts:[{text:'你是「小樹苗」，CoolCity 都市高溫調適與綠蔭改善共創平台的繁體中文 AI 小幫手。以友善、簡短、準確的方式回答。CoolCity 面向全臺灣，不限定北大特區；北大特區僅為步行路線示範區。不要聲稱已經取得使用者位置、即時氣象資料或已提交回報。遇到未知資訊坦承不確定。勿要求密碼、API 金鑰或個人敏感資料。'}]},
    contents:[{role:'user',parts:[{text:input}]}],
    generationConfig:{maxOutputTokens:CFG.maxOutput,temperature:0.5}
  };
  const response = UrlFetchApp.fetch(endpoint, {method:'post', contentType:'application/json', headers:{'x-goog-api-key':key},payload:JSON.stringify(payload),muteHttpExceptions:true});
  if (response.getResponseCode() !== 200) {
    console.error('Gemini HTTP '+response.getResponseCode()+' '+response.getContentText().slice(0,500));
    throw new Error('小樹苗暫時無法回答，請稍後再試。');
  }
  const data=JSON.parse(response.getContentText());
  const answer=(data.candidates||[]).flatMap(x=>(x.content&&x.content.parts)||[]).map(p=>p.text||'').join('\n').trim();
  if(!answer) throw new Error('這個問題暫時無法回答，請換個方式詢問。');
  return answer.slice(0,4000);
}
function verifyFirebase_(idToken) {
  if(typeof idToken!=='string'||idToken.length<100||idToken.length>5000)throw new Error('請先登入 CoolCity 會員。');
  const apiKey=PropertiesService.getScriptProperties().getProperty('FIREBASE_WEB_API_KEY');
  if(!apiKey)throw new Error('尚未設定 Firebase Web API Key。');
  const response=UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='+encodeURIComponent(apiKey),{
    method:'post',contentType:'application/json',payload:JSON.stringify({idToken:idToken}),muteHttpExceptions:true
  });
  if(response.getResponseCode()!==200)throw new Error('登入狀態已失效，請重新登入。');
  const users=JSON.parse(response.getContentText()).users||[];
  if(users.length!==1||!users[0].localId||users[0].disabled)throw new Error('無法驗證會員身分。');
  return users[0].localId;
}
function enforceQuota_(uid){
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(8000))throw new Error('目前使用人數較多，請稍後再試。');
  try{
    const store=PropertiesService.getScriptProperties();
    const date=Utilities.formatDate(new Date(),'Asia/Taipei','yyyyMMdd');
    const hash=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,uid).map(x=>('0'+(x&255).toString(16)).slice(-2)).join('').slice(0,24);
    const ukey='q_'+date+'_'+hash, gkey='global_'+date;
    const u=Number(store.getProperty(ukey)||0),g=Number(store.getProperty(gkey)||0);
    if(u>=CFG.dailyPerUser)throw new Error('今天的小樹苗對話次數已達上限，請明天再來。');
    if(g>=CFG.dailyGlobal)throw new Error('今天的小樹苗服務額度已用完，請明天再試。');
    store.setProperties({[ukey]:String(u+1),[gkey]:String(g+1)},false);
  }finally{lock.releaseLock();}
}
