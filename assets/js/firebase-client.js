// Frontend release 2.1.4; keep module URL identical in all entry points.
// Firebase public web configuration. This is NOT a Gemini API secret.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,sendEmailVerification,updateProfile} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import {getFirestore,collection,doc,setDoc,serverTimestamp,query,where,getDocs,updateDoc,deleteDoc} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';

import {getFunctions,httpsCallable} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-functions.js';
import {getStorage,ref,uploadBytesResumable,getDownloadURL,deleteObject} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js';
const firebaseConfig={apiKey:'AIzaSyBph6cwhRQNTXoVESBj-oxBxpiyfKZptks',authDomain:'coolcity-54b1f.firebaseapp.com',projectId:'coolcity-54b1f',storageBucket:'coolcity-54b1f.firebasestorage.app',messagingSenderId:'21609428521',appId:'1:21609428521:web:ef517540282bc8c2ce4e38',measurementId:'G-G6PJ03YECM'};
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),functions=getFunctions(app,'asia-east1'),storage=getStorage(app);
export const watchAuth=callback=>onAuthStateChanged(auth,callback);
export const loginGoogle=()=>signInWithPopup(auth,new GoogleAuthProvider());
export const logout=()=>signOut(auth);
export const registerEmail=async(email,password,name)=>{const result=await createUserWithEmailAndPassword(auth,email,password);if(name?.trim())await updateProfile(result.user,{displayName:name.trim().slice(0,60)});await sendEmailVerification(result.user);return result.user;};
export const loginEmail=(email,password)=>signInWithEmailAndPassword(auth,email,password);
export const resetPassword=email=>sendPasswordResetEmail(auth,email);
export const resendVerification=()=>{if(!auth.currentUser)throw Error('請先登入');return sendEmailVerification(auth.currentUser);};

export const authInstance=auth;
export async function chatWithSeedling(message,history=[]){const callable=httpsCallable(functions,'chatWithSeedling',{timeout:60000});const result=await callable({message,history});return result.data;}
export async function saveReport(data,photoBlob=null,onProgress=()=>{}){
 const user=auth.currentUser;if(!user)throw Error('請先登入');
 const reportRef=doc(collection(db,'reports'));let photoPath='';
 if(photoBlob){if(photoBlob.size>5*1024*1024)throw Error('照片不得超過 5MB');const mime=photoBlob.type;if(!['image/jpeg','image/png','image/webp'].includes(mime))throw Error('只接受 JPEG、PNG 或 WebP');const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[mime];photoPath=`reports/${user.uid}/${reportRef.id}.${ext}`;await new Promise((resolve,reject)=>{
  const task=uploadBytesResumable(ref(storage,photoPath),photoBlob,{contentType:mime,customMetadata:{ownerUid:user.uid,reportId:reportRef.id}});
  let settled=false,watchdog;
  const finish=(error)=>{if(settled)return;settled=true;clearTimeout(watchdog);if(error)reject(error);else resolve();};
  const resetWatchdog=()=>{clearTimeout(watchdog);watchdog=setTimeout(()=>{task.cancel();finish(Object.assign(new Error('照片上傳超過 45 秒沒有進度，已停止上傳。請檢查網路及 Firebase Storage 設定。'),{code:'storage/upload-stalled'}));},45000);};
  resetWatchdog();
  task.on('state_changed',snapshot=>{resetWatchdog();onProgress({stage:'upload',percent:Math.round(snapshot.bytesTransferred/Math.max(snapshot.totalBytes,1)*100)});},error=>finish(error),()=>finish());
 });}
 const safe={schemaVersion:2,status:'pending',source:'citizen_observation_unverified',ownerUid:user.uid,location:data.location,category:data.category,place:data.place||'',observationDate:data.observationDate,shadeObservation:data.shadeObservation,description:data.description||'',photoPath,createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
 try{onProgress({stage:'database'});await setDoc(reportRef,safe);}catch(err){if(photoPath)await deleteObject(ref(storage,photoPath)).catch(()=>{});throw err;}
 return reportRef.id;
}
export async function listMyReports(){const user=auth.currentUser;if(!user)return [];const snap=await getDocs(query(collection(db,'reports'),where('ownerUid','==',user.uid)));return snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.observationDate||'').localeCompare(a.observationDate||''));}
export async function listPendingReports(){const user=auth.currentUser;if(!user)throw Error('請先登入');const token=await user.getIdTokenResult();if(token.claims.admin!==true)throw Error('權限不足');const snap=await getDocs(query(collection(db,'reports'),where('status','==','pending')));return snap.docs.map(d=>({id:d.id,...d.data()}));}
export async function reviewReport(id,status){if(!['approved','rejected'].includes(status))throw Error('無效狀態');const user=auth.currentUser;if(!user)throw Error('請先登入');const token=await user.getIdTokenResult();if(token.claims.admin!==true)throw Error('權限不足');await updateDoc(doc(db,'reports',id),{status,updatedAt:serverTimestamp(),reviewedAt:serverTimestamp(),reviewedBy:user.uid});}
export async function reportPhotoUrl(path){return getDownloadURL(ref(storage,path));}
