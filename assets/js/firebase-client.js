// Firebase public web configuration. This is NOT a Gemini API secret.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,sendEmailVerification,updateProfile} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import {getFirestore,collection,doc,setDoc,serverTimestamp,query,where,getDocs} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';

const firebaseConfig={apiKey:'AIzaSyBph6cwhRQNTXoVESBj-oxBxpiyfKZptks',authDomain:'coolcity-54b1f.firebaseapp.com',projectId:'coolcity-54b1f',storageBucket:'coolcity-54b1f.firebasestorage.app',messagingSenderId:'21609428521',appId:'1:21609428521:web:ef517540282bc8c2ce4e38',measurementId:'G-G6PJ03YECM'};
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
export const watchAuth=callback=>onAuthStateChanged(auth,callback);
export const loginGoogle=()=>signInWithPopup(auth,new GoogleAuthProvider());
export const logout=()=>signOut(auth);
export const registerEmail=async(email,password,name)=>{const result=await createUserWithEmailAndPassword(auth,email,password);if(name?.trim())await updateProfile(result.user,{displayName:name.trim().slice(0,60)});await sendEmailVerification(result.user);return result.user;};
export const loginEmail=(email,password)=>signInWithEmailAndPassword(auth,email,password);
export const resetPassword=email=>sendPasswordResetEmail(auth,email);
export const resendVerification=()=>{if(!auth.currentUser)throw Error('請先登入');return sendEmailVerification(auth.currentUser);};

export const authInstance=auth;
export async function saveReport(data){const user=auth.currentUser;if(!user)throw Error('請先登入');const ref=doc(collection(db,'reports'));const safe={schemaVersion:2,status:'pending',source:'citizen_observation_unverified',ownerUid:user.uid,location:data.location,category:data.category,place:data.place||'',observationDate:data.observationDate,shadeObservation:data.shadeObservation,description:data.description||'',createdAt:serverTimestamp(),updatedAt:serverTimestamp()};await setDoc(ref,safe);return ref.id;}
export async function listMyReports(){const user=auth.currentUser;if(!user)return [];const snap=await getDocs(query(collection(db,'reports'),where('ownerUid','==',user.uid)));return snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.observationDate||'').localeCompare(a.observationDate||''));}
