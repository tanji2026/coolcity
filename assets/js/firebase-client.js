// Firebase public web configuration. This is NOT a Gemini API secret.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import {getFirestore,collection,doc,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
import {getStorage,ref,uploadBytes} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js';
const firebaseConfig={apiKey:'AIzaSyBph6cwhRQNTXoVESBj-oxBxpiyfKZptks',authDomain:'coolcity-54b1f.firebaseapp.com',projectId:'coolcity-54b1f',storageBucket:'coolcity-54b1f.firebasestorage.app',messagingSenderId:'21609428521',appId:'1:21609428521:web:ef517540282bc8c2ce4e38',measurementId:'G-G6PJ03YECM'};
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),storage=getStorage(app);
export const watchAuth=callback=>onAuthStateChanged(auth,callback);
export const loginGoogle=()=>signInWithPopup(auth,new GoogleAuthProvider());
export const logout=()=>signOut(auth);
export async function submitReport(record,photoBlob,user){
 if(!user||auth.currentUser?.uid!==user.uid)throw Error('請先登入。');
 const docRef=doc(collection(db,'reports'));
 const photoPath=`reports/${user.uid}/${docRef.id}/photo.jpg`;
 await uploadBytes(ref(storage,photoPath),photoBlob,{contentType:'image/jpeg',customMetadata:{reportId:docRef.id}});
 await setDoc(docRef,{...record,ownerUid:user.uid,photoPath,photoContentType:'image/jpeg',createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
 return docRef.id;
}
