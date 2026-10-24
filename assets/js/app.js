import {TAIWAN_DISTRICTS} from './taiwan-districts.js';
// All pages share one versioned Firebase module import.
const loadFirebase=()=>import('./firebase-client.js?v=2.1.7');
const app=document.querySelector('#app');const nav=document.querySelector('#nav');const menu=document.querySelector('#menu');
const intro=(label,title,description)=>`<span class="eyebrow">${label}</span><h1 class="section-title">${title}</h1><p class="lead">${description}</p>`;
const card=(num,title,desc,route)=>`<article class="card"><span class="number">${num}</span><h3>${title}</h3><p>${desc}</p><a class="textlink" href="#${route}">前往查看 ↗</a></article>`;
const pages={
 home:()=>`<section class="hero"><div class="eyebrow">COOLCITY · TANJI</div><h1>走在城市的每一步，<br>都有綠蔭相伴</h1><p>查看氣溫、探索綠蔭，分享你在街道上的觀察。</p><div class="weather-box"><strong>查詢當地氣溫</strong><div class="weather-controls"><button class="btn secondary" id="weather-locate" type="button">◎ 使用目前位置</button><select id="weather-city" aria-label="選擇縣市"><option value="">選擇縣市</option></select><select id="weather-district" aria-label="選擇行政區" disabled><option value="">選擇行政區</option></select><button id="weather-search" class="btn secondary" type="button" disabled>查詢氣溫</button></div><div class="weather-strip" id="weather-strip" role="status" aria-live="polite" hidden><span class="weather-temp" id="weather-temp">--°C</span><span><small id="weather-meta"></small></span></div><small id="weather-help" role="status" aria-live="polite">模式氣溫僅供參考，不代表測站實測。</small></div><div class="actions"><a class="btn primary" href="#map">探索地圖↗</a><a class="btn secondary" href="#report">分享現場觀察↗</a></div></section><section class="container"><div class="cards">${card('01','綠蔭地圖','查看道路與已審核的民眾觀察。','map')}${card('02','現場回報','拍照、選地點，提供改善線索。','report')}${card('03','調適分析','看已核准回報的類別分布。','analysis')}</div></section>`,
 map:()=>`<section class="container">${intro('SHADE MAP','綠蔭地圖','看道路，也看已通過審核的現場觀察。')}<div class="map-tools"><label class="switch-row"><input type="checkbox" id="map-show-reports" checked> 顯示已審核回報</label><span id="public-map-status" class="muted" role="status" aria-live="polite">正在載入回報…</span></div><div class="map-layout"><div><div id="coolcity-map" role="application" aria-label="道路與已核准回報地圖"></div><div class="map-legend"><span><i></i>道路線段</span><span class="ped"><i></i>步道相關線段</span><span class="public-dot">● 已核准觀察（位置約略）</span></div><p class="muted">道路類型不等於實際遮蔭程度；民眾觀察為個別回報，並非官方測量。地圖 © OpenStreetMap contributors。</p></div><aside class="panel"><h3>地圖資訊</h3><div id="road-detail"><p class="muted">點選道路或回報標記查看資訊。</p></div><hr><h3>資料來源</h3><p class="muted">道路：OpenStreetMap／Geofabrik；已核准回報由 CoolCity 審核後呈現。公開座標已模糊化。</p></aside></div></section>`,
 report:()=>`<section class="container">${intro('CITIZEN REPORT','綠蔭回報','用手機拍照、確認地圖位置，再選擇現場情況。回報資料以單一觀察點記錄，不會直接當成整條道路的遮蔭狀態。')}<div class="report-layout"><div class="report-map-panel"><div class="map-guide"><strong>確認位置</strong>點選地圖或使用目前位置；標記可以拖動微調。</div><div id="report-map" aria-label="選擇回報位置的互動地圖"></div><div class="location-tools"><button class="btn" id="locate-me" type="button">◎ 使用目前位置</button><span id="selected-coordinates" aria-live="polite">尚未選擇位置</span></div><p class="muted">定位須經你授權，且可能有誤差；請在地圖上確認實際拍攝地點。地圖 © OpenStreetMap contributors。</p></div><section class="panel"><h3>拍照與現況</h3><form id="report-form" class="form"><div class="field"><label for="photo">現場照片</label><input id="photo" type="file" accept="image/*" ><small>可直接拍照或從相簿選擇。請避開人臉、車牌及住家資訊；照片會先在裝置內縮小。</small><img id="photo-preview" class="photo-preview" alt="待回報的照片預覽" hidden></div><div class="field"><label for="kind">回報類型</label><select id="kind" required><option value="">請選擇</option><option>遮蔭不足</option><option>有樹蔭</option><option>樹木修剪或移除</option><option>步行空間問題</option><option>其他觀察</option></select></div><div class="field"><label for="shade">現場遮蔭情形</label><select id="shade" required><option value="">請選擇</option><option>幾乎無遮蔭</option><option>部分遮蔭</option><option>較連續的遮蔭</option><option>無法判斷</option></select></div><div class="field"><label for="observed-at">觀察日期</label><input id="observed-at" type="date" required></div><div class="field"><label for="place">地點補充（選填）</label><input id="place" maxlength="120" placeholder="例如：公車站旁的人行道"><small>以地圖座標為主，不需要自行寫完整地址或道路名稱。</small></div><div class="field"><label for="detail">其他現場說明（選填）</label><textarea id="detail" maxlength="600" placeholder="例如：樹冠很小、遮蔭不連續、步道旁沒有樹。"></textarea></div><div class="actions"><button class="btn primary" type="submit">預覽回報</button><button class="btn" id="clear-report" type="button">清除</button></div></form><div id="report-result" aria-live="polite"></div><div class="report-auth"><h3>送出回報</h3><p class="muted">登入後即可送出；電子郵件會員請先到會員中心登入。</p><p class="muted">審核通過後，回報類型、日期與約略地點會顯示於公開地圖；照片不公開。</p><div class="actions"><a class="btn primary" href="#account">登入／註冊</a><button class="btn" id="google-login" type="button">Google 快速登入</button><button class="btn" id="google-logout" type="button" hidden>登出</button></div><p id="auth-status" class="muted" aria-live="polite">正在確認登入狀態…</p><button class="btn primary" id="submit-report" type="button" hidden>送出回報</button><p id="submit-status" aria-live="polite" class="muted"></p></div></section></div></section>`,
 analysis:()=>`<section class="container">${intro('ADAPTATION ANALYSIS','調適分析','從已核准的現場回報，了解常見的街道問題。')}<div class="analysis-shell"><div id="analysis-status" class="muted" role="status" aria-live="polite">正在整理已核准回報…</div><div id="analysis-results" hidden><div class="analysis-metrics"><article class="metric"><strong id="metric-total">—</strong><span>已核准觀察（本次載入）</span></article><article class="metric"><strong id="metric-shade">—</strong><span>回報遮蔭不足</span></article><article class="metric"><strong id="metric-tree">—</strong><span>回報有樹蔭</span></article></div><div class="analysis-grid"><section class="panel"><h2>回報類型</h2><div id="analysis-categories" class="analysis-bars"></div></section><section class="panel"><h2>現場遮蔭</h2><div id="analysis-shade" class="analysis-bars"></div></section></div><p id="analysis-note" class="muted"></p><a class="btn primary" href="#map">在地圖上查看回報↗</a></div></div></section>`,
 walk:()=>`<section class="container"><span class="eyebrow">COOLCITY · WALK</span><h1 class="section-title">找一條好走的路</h1><p class="lead">目前以北大特區作為路線示範區域。選擇出發地與目的地，探索步行路線。</p><div class="route-shell"><div class="panel route-controls"><label for="route-start">從哪裡出發？</label><select id="route-start"><option value="24.9446,121.3735">北大特區・學勤路</option><option value="24.9466,121.3759">北大特區・學成路</option><option value="24.9414,121.3702">臺北大學・三峽校區</option><option value="custom">在地圖上選位置</option></select><label for="route-end">要去哪裡？</label><select id="route-end"><option value="24.9414,121.3702">臺北大學・三峽校區</option><option value="24.9446,121.3735">北大特區・學勤路</option><option value="24.9466,121.3759">北大特區・學成路</option><option value="custom">在地圖上選位置</option></select><div class="actions"><button type="button" class="btn primary" id="route-go">查看步行路線</button><button type="button" class="btn secondary" id="route-gps">從我的位置出發</button></div><p id="route-status" aria-live="polite" class="muted">可選擇地點，或直接在地圖上設定起點與終點。</p><div id="route-summary"></div><p class="muted">路線由公開路網資料試算，實際通行請以現場為準。</p></div><div id="route-map" aria-label="步行路線地圖"></div></div></section>`,
 account:()=>`<section class="container account-page"><span class="eyebrow">COOLCITY · ACCOUNT</span><h1 class="section-title">會員中心</h1><div class="panel account-shell"><div id="member-content"><p>正在讀取會員資料…</p></div><div id="member-email-panel"><div class="member-auth-modes" role="group" aria-label="登入或註冊"><button class="btn" id="member-mode-login" type="button" aria-pressed="true">登入</button><button class="btn" id="member-mode-register" type="button" aria-pressed="false">建立帳號</button></div><form id="member-email-form" class="form"><div class="field" id="member-name-field" hidden><label for="member-name">顯示名稱</label><input id="member-name" autocomplete="nickname" maxlength="60"></div><div class="field"><label for="member-email">電子郵件</label><input id="member-email" type="email" autocomplete="email" required></div><div class="field" id="member-password-field"><label for="member-password">密碼</label><input id="member-password" type="password" minlength="6" autocomplete="current-password" required></div><button class="btn primary member-main-submit" id="member-email-submit" type="submit">登入</button></form><button class="member-text-link" id="member-mode-reset" type="button" aria-pressed="false">忘記密碼？</button><div class="member-separator"><span>或</span></div><button class="btn member-google" id="member-login" type="button" hidden>使用 Google 登入</button></div><div class="member-actions"><button class="btn" id="member-verify" type="button" hidden>重寄驗證信</button><button class="btn secondary" id="member-logout" type="button" hidden>登出</button></div><p id="member-status" class="muted" role="status" aria-live="polite"></p></div></section>`

};
function render(){const page=location.hash.replace('#','')||'home';try{app.innerHTML=(pages[page]||pages.home)();}catch(error){console.error('CoolCity page render error:',error);app.innerHTML='<section class="container"><h1>頁面暫時無法顯示</h1><p>請重新整理或返回首頁。其他分頁仍可使用。</p><a class="btn primary" href="#home">返回首頁</a></section>';return;}document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.page===page));nav.classList.remove('open');menu.setAttribute('aria-expanded','false');document.title=`${page==='home'?'CoolCity':({map:'綠蔭地圖',report:'綠蔭回報',analysis:'調適分析',walk:'步行路線',account:'會員中心'}[page]||'CoolCity')}｜CoolCity`;window.scrollTo({top:0,behavior:'instant'});try{if(page==='home')initWeather();if(page==='account')initAccount();if(page==='map')initMap();if(page==='analysis')initAnalysis();if(page==='report')initReport().catch(e=>console.error('Report initialization failed:',e));if(page==='walk')initWalk();}catch(error){console.error('CoolCity page initialization error:',error);const notice=document.createElement('p');notice.className='notice';notice.textContent='部分互動功能暫時無法載入，其他頁面仍可瀏覽。';app.prepend(notice);}}menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});window.addEventListener('hashchange',render);

// Member account: restore Google sign-in and email account controls.
function initAccount(){
 const $=id=>document.getElementById(id), login=$('member-login'),logout=$('member-logout'),verify=$('member-verify'),content=$('member-content'),status=$('member-status'),panel=$('member-email-panel'),form=$('member-email-form'),submit=$('member-email-submit'),register=$('member-mode-register'),loginMode=$('member-mode-login'),reset=$('member-mode-reset'),nameField=$('member-name-field'),passwordField=$('member-password-field');
 let mode='login',cloud=null,epoch=0,busy=false;
 const say=t=>{if(status)status.textContent=t};
 const setBusy=(value,label='')=>{busy=value;submit.disabled=value;loginMode.disabled=value;register.disabled=value;reset.disabled=value;if(label)submit.textContent=label;};
 const setMode=m=>{if(busy)return;mode=m;nameField.hidden=m!=='register';passwordField.hidden=m==='reset';$('member-password').required=m!=='reset';$('member-password').autocomplete=m==='register'?'new-password':'current-password';submit.textContent=m==='register'?'建立帳號':m==='reset'?'寄送重設密碼郵件':'登入';loginMode.setAttribute('aria-pressed',String(m==='login'));register.setAttribute('aria-pressed',String(m==='register'));reset.setAttribute('aria-pressed',String(m==='reset'));say(m==='register'?'':m==='reset'?'輸入信箱後寄送重設密碼郵件。':'');};
 const errorMessage=(e,operation)=>{const code=e?.code||'';const map={'auth/email-already-in-use':'這個電子郵件已註冊。請切換至登入，或使用「忘記密碼」。','auth/invalid-email':'電子郵件格式不正確。','auth/weak-password':'密碼強度不足，請設定更安全的密碼。','auth/password-does-not-meet-requirements':'密碼未符合安全要求，請調整後再試。','auth/invalid-credential':'電子郵件或密碼不正確；若曾使用 Google 登入，不能直接以同一信箱使用密碼登入。','auth/user-disabled':'這個帳號已被停用，請聯絡管理者。','auth/too-many-requests':'嘗試次數過多，請稍後再試。','auth/network-request-failed':'網路連線失敗，請檢查網路後重試。','auth/operation-not-allowed':'此登入方式尚未啟用，請聯絡網站管理者。','auth/unauthorized-domain':'網站網域未列入 Firebase 授權網域。','auth/popup-blocked':'瀏覽器阻擋登入視窗，請允許彈出視窗。'};return map[code]||`${operation}失敗：${code||e?.message||'未知錯誤'}`;};
 login.hidden=false;login.disabled=true;content.textContent='正在確認登入狀態…';setMode('login');
 loginMode.addEventListener('click',()=>setMode('login'));
 register.addEventListener('click',()=>setMode('register'));
 reset.addEventListener('click',()=>setMode('reset'));
 loadFirebase().then(fb=>{
  if(!document.getElementById('member-login'))return;
  cloud=fb;login.disabled=false;
  fb.watchAuth(async user=>{
   if(!document.getElementById('member-login'))return;
   const run=++epoch;login.hidden=!!user;logout.hidden=!user;verify.hidden=!user||user.emailVerified||!user.providerData.some(p=>p.providerId==='password');panel.hidden=!!user;
   if(!user){content.textContent='登入後即可查看會員資料與自己的回報。';return;}
   content.replaceChildren();const h=document.createElement('h3');h.textContent=user.displayName||'會員';const email=document.createElement('p');email.textContent=user.email||'';content.append(h,email);
   if(user.getIdTokenResult){const token=await user.getIdTokenResult();if(token.claims.admin===true){const adminHeading=document.createElement('h3');adminHeading.textContent='待審核回報';content.append(adminHeading);const adminList=document.createElement('div');adminList.textContent='正在讀取…';content.append(adminList);try{const pending=await fb.listPendingReports();adminList.replaceChildren();if(!pending.length)adminList.textContent='目前沒有待審核回報。';for(const item of pending){const box=document.createElement('div');box.className='member-report-item';const p=document.createElement('p');p.textContent=[item.category,item.observationDate,item.place,item.description].filter(Boolean).join(' · ');box.append(p);if(item.photoPath){const a=document.createElement('a');a.textContent='查看照片';a.target='_blank';a.rel='noopener noreferrer';try{a.href=await fb.reportPhotoUrl(item.photoPath);box.append(a);}catch(photoError){const note=document.createElement('span');note.textContent='照片目前無法讀取';box.append(note);console.warn('管理員照片讀取失敗',photoError);}}for(const [status,label] of [['approved','通過'],['rejected','不通過']]){const b=document.createElement('button');b.className='btn';b.type='button';b.textContent=label;b.addEventListener('click',async()=>{b.disabled=true;try{await fb.reviewReport(item.id,status);box.remove();}catch(e){b.disabled=false;alert('審核失敗：'+(e.code||e.message));}});box.append(b);}adminList.append(box);}}catch(e){adminList.textContent='目前無法讀取待審核資料。';console.error(e);}}}
   const heading=document.createElement('h3');heading.textContent='我的回報';content.append(heading);const list=document.createElement('div');list.textContent='正在讀取回報…';content.append(list);
   try{const items=await fb.listMyReports();if(run!==epoch||!document.getElementById('member-login'))return;list.replaceChildren();if(!items.length){list.textContent='目前沒有回報紀錄。';return;}for(const item of items){const row=document.createElement('p');row.className='member-report-item';row.textContent=[item.category||'現場回報',item.observationDate||'',item.status==='pending'?'待審核':item.status==='approved'?'已通過':item.status==='rejected'?'未通過':item.status||''].filter(Boolean).join(' · ');list.append(row);}}catch(e){list.textContent='目前無法讀取回報紀錄，請確認 Firestore 規則已發布，或稍後重試。';console.error('我的回報讀取失敗',e);}
  });
  login.addEventListener('click',async()=>{try{say('正在開啟 Google 登入…');await fb.loginGoogle();say('');}catch(e){say('Google 登入失敗：'+(e.code||e.message));}});
  logout.addEventListener('click',async()=>{try{await fb.logout();say('已登出。');}catch(e){say('登出失敗：'+e.message)}});
  verify.addEventListener('click',async()=>{try{await fb.resendVerification();say('驗證信已寄出。');}catch(e){say('寄送失敗：'+e.message)}});
  form.addEventListener('submit',async e=>{e.preventDefault();if(busy||!form.reportValidity())return;const email=$('member-email').value.trim(),password=$('member-password').value,action=mode;setBusy(true,action==='register'?'正在建立帳號…':action==='reset'?'正在寄送郵件…':'正在登入…');say('處理中，請稍候…');try{if(action==='reset'){await fb.resetPassword(email);say('如果此電子郵件有可使用密碼重設的帳號，將收到重設郵件。請檢查收件匣及垃圾郵件。');}else if(action==='register'){const result=await fb.registerEmail(email,password,$('member-name').value);if(result.verificationSent){say('帳號建立成功！驗證信已寄出，請檢查收件匣及垃圾郵件。');}else{say('帳號建立成功，但驗證信寄送失敗（'+(result.verificationError?.code||'未知原因')+'）。請使用「重新寄送驗證信」再試，無須重複註冊。');}$('member-password').value='';}else{await fb.loginEmail(email,password);say('登入成功。');$('member-password').value='';}}catch(err){say(errorMessage(err,action==='register'?'建立帳號':action==='reset'?'重設密碼':'登入'));}finally{setBusy(false);submit.textContent=action==='register'?'建立帳號':action==='reset'?'寄送重設密碼郵件':'登入';}});
 }).catch(e=>{login.disabled=true;content.textContent='會員服務暫時無法載入。';say('Firebase 載入失敗，請稍後重新整理。');console.error(e)});
}

const treeCounts={'學勤路':{sidewalk:162,median:42},'學成路':{sidewalk:225,median:51},'學府路':{sidewalk:215},'大學路':{sidewalk:186},'三樹路':{sidewalk:94,median:34},'大義路':{sidewalk:96},'國慶路':{sidewalk:72},'龍埔路':{sidewalk:143}};
const pedestrianClasses=new Set(['footway','pedestrian','path','steps']);
async function initMap(){
 const el=document.querySelector('#coolcity-map');if(!el)return;
 if(!window.L){el.textContent='地圖程式無法載入，請檢查網路連線。';return;}
 const map=L.map(el,{scrollWheelZoom:true,zoomControl:true,preferCanvas:true}).setView([24.946,121.377],15);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',maxZoom:19}).addTo(map);
 try{
  const response=await fetch('./assets/data/roads.geojson');if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();
  const layer=L.geoJSON(data,{style:f=>({color:pedestrianClasses.has(f.properties?.fclass)?'#d88435':'#287da3',weight:pedestrianClasses.has(f.properties?.fclass)?3:4,opacity:.85}),onEachFeature:(f,l)=>{
   l.on('click',()=>{const p=f.properties||{}, name=p.name||'未命名線段', count=treeCounts[name],isPed=pedestrianClasses.has(p.fclass);
    const div=document.querySelector('#road-detail');div.replaceChildren();
    const h=document.createElement('h3');h.textContent=name;div.append(h);
    const typ=document.createElement('p');typ.textContent='OSM 類型：'+(p.fclass||'未分類')+(isPed?'（行人相關）':'（道路）');div.append(typ);
    const id=document.createElement('p');id.className='muted';id.textContent='OSM ID：'+(p.osm_id||'未提供');div.append(id);
    const tr=document.createElement('p');tr.textContent=count?`新北市政府道路層級行道樹紀錄：人行道 ${count.sidewalk||0} 株${count.median!==undefined?'、中央分隔島 '+count.median+' 株':''}。此數量不代表所選線段上的樹木。`:'目前未對應到此道路名稱的行道樹統計（不代表沒有樹）。';div.append(tr);
    const note=document.createElement('p');note.className='muted';note.textContent='遮蔭狀況：尚待現地確認。';div.append(note);
   });
  }}).addTo(map);
  if(layer.getBounds().isValid())map.fitBounds(layer.getBounds(),{padding:[24,24],maxZoom:16});
 }catch(e){el.insertAdjacentHTML('beforeend','<div class="map-error">道路資料載入失敗。請確認 assets/data/roads.geojson 已上傳。</div>');console.error(e)}
 // Approved reports are fetched through a privacy-filtered Cloud Function.
 const reportToggle=document.getElementById('map-show-reports');
 const reportStatus=document.getElementById('public-map-status');
 const markers=L.layerGroup().addTo(map);
 const showDetail=item=>{
   const div=document.getElementById('road-detail');if(!div)return;div.replaceChildren();
   const title=document.createElement('h3');title.textContent=item.category||'已審核現場回報';div.append(title);
   for(const [name,value] of [['觀察日期',item.observationDate],['遮蔭情況',item.shadeObservation],['位置','約略位置（已模糊化）']]){
     const row=document.createElement('p');const b=document.createElement('strong');b.textContent=name+'：';row.append(b,document.createTextNode(value||'未提供'));div.append(row);
   }
   const note=document.createElement('p');note.className='muted';note.textContent='資料為經審核的民眾觀察，非官方實測；為保護隱私，不公開原始照片及精確座標。';div.append(note);
 };
 reportToggle.addEventListener('change',()=>{if(reportToggle.checked)markers.addTo(map);else map.removeLayer(markers);});
 try{
   const result=await getPublicReports();
   if(!document.getElementById('coolcity-map'))return;
   for(const item of result.reports){
     const lat=item.lat,lon=item.lon;
     if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
     const m=L.circleMarker([lat,lon],{radius:8,color:'#fff',weight:2,fillColor:'#1f8055',fillOpacity:.95});
     m.bindTooltip(item.category||'現場觀察');m.on('click',()=>showDetail(item));markers.addLayer(m);
   }
   reportStatus.textContent=`已載入 ${result.reports.length} 筆已核准回報${result.limited?'（僅顯示部分資料）':''}`;
 }catch(error){console.warn('公開回報尚無法載入',error);reportStatus.textContent=error.code==='functions/not-found'?'公開回報功能尚未部署，地圖仍可正常使用。':'已審核回報暫時無法載入，道路地圖仍可使用。';}
 requestAnimationFrame(()=>map.invalidateSize({pan:false}));
 setTimeout(()=>map.invalidateSize({pan:false}),250);
}

// Public data is always filtered server-side. Never read the private /reports collection as a guest.
let publicReportsCache=null;
async function getPublicReports(){
 if(publicReportsCache&&Date.now()-publicReportsCache.time<90000)return publicReportsCache.promise;
 const promise=loadFirebase().then(fb=>fb.listPublicReports());
 publicReportsCache={time:Date.now(),promise};
 try{return await promise;}catch(error){publicReportsCache=null;throw error;}
}
function initAnalysis(){
 const status=document.getElementById('analysis-status'),results=document.getElementById('analysis-results');
 if(!status||!results)return;
 getPublicReports().then(data=>{
   if(!document.getElementById('analysis-results'))return;
   const reports=data.reports||[];
   const count=(field)=>{const map=new Map();for(const item of reports){const key=item[field]||'未分類';map.set(key,(map.get(key)||0)+1);}return [...map.entries()].sort((a,b)=>b[1]-a[1]);};
   const renderBars=(id,pairs)=>{
     const root=document.getElementById(id);root.replaceChildren();
     if(!pairs.length){root.textContent='目前尚無已核准回報。';return;}
     const max=Math.max(...pairs.map(p=>p[1]),1);
     for(const [label,num] of pairs){
       const row=document.createElement('div');row.className='analysis-bar-row';
       const head=document.createElement('div');head.className='analysis-bar-head';
       const name=document.createElement('span');name.textContent=label;const val=document.createElement('strong');val.textContent=String(num);head.append(name,val);
       const track=document.createElement('div');track.className='analysis-bar-track';
       const fill=document.createElement('div');fill.className='analysis-bar-fill';fill.style.width=(num/max*100)+'%';track.append(fill);row.append(head,track);root.append(row);
     }
   };
   document.getElementById('metric-total').textContent=String(reports.length);
   document.getElementById('metric-shade').textContent=String(reports.filter(x=>x.category==='遮蔭不足').length);
   document.getElementById('metric-tree').textContent=String(reports.filter(x=>x.category==='有樹蔭').length);
   renderBars('analysis-categories',count('category'));renderBars('analysis-shade',count('shadeObservation'));
   document.getElementById('analysis-note').textContent='資料僅含已核准的民眾觀察（最多顯示近期 250 筆），不代表城市整體遮蔭比例，也不等於官方氣象或樹冠測量。'+(data.limited?' 本次資料已達顯示上限。':'');
   status.textContent=reports.length?'依本次已核准回報整理。':'目前還沒有已核准的回報；有資料後會自動產生圖表。';results.hidden=false;
 }).catch(error=>{console.error('調適分析資料載入失敗',error);status.textContent=error.code==='functions/not-found'?'分析資料服務尚未部署；部署後即可使用。':'目前無法取得分析資料，請稍後再試。';});
}

// Local report preview; photo upload requires a secure backend.
function localDateString(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
async function initReport(){
 const el=document.querySelector('#report-map');if(!el)return;
 const form=document.querySelector('#report-form'),out=document.querySelector('#report-result'),status=document.querySelector('#selected-coordinates');
 const submitBtn=document.querySelector('#submit-report'),submitStatus=document.querySelector('#submit-status');
 const photoInput=document.querySelector('#photo'),photoPreview=document.querySelector('#photo-preview');
 const date=document.querySelector('#observed-at');date.value=localDateString();date.max=date.value;
 let point=null,marker=null,reportMap=null,photoBlob=null,previewUrl=null,currentRecord=null,currentUser=null,cloud=null,photoGeneration=0;
 const say=(message)=>{submitStatus.textContent=message;};
 const resetPreview=()=>{currentRecord=null;out.replaceChildren();submitBtn.disabled=true;submitBtn.hidden=true;};
 form.addEventListener('input',resetPreview);form.addEventListener('change',resetPreview);
 const updatePoint=(latlng)=>{point={lat:Number(latlng.lat.toFixed(6)),lng:Number(latlng.lng.toFixed(6))};if(marker)marker.setLatLng(latlng);else marker=L.marker(latlng,{draggable:true}).addTo(reportMap).on('dragend',e=>updatePoint(e.target.getLatLng()));status.textContent=`已選位置：${point.lat}, ${point.lng}（可拖動標記）`;resetPreview();};
 if(window.L){reportMap=L.map(el,{zoomControl:true,scrollWheelZoom:true}).setView([24.946,121.377],15);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',maxZoom:19}).addTo(reportMap);reportMap.on('click',e=>updatePoint(e.latlng));requestAnimationFrame(()=>reportMap.invalidateSize());setTimeout(()=>reportMap.invalidateSize(),200);}else el.textContent='地圖程式無法載入，請檢查網路連線。';
 document.querySelector('#locate-me').addEventListener('click',()=>{if(!navigator.geolocation){say('這個瀏覽器不支援定位，請直接在地圖選點。');return;}say('正在取得目前位置…');navigator.geolocation.getCurrentPosition(pos=>{if(!reportMap){say('地圖尚未載入，請確認網路連線。');return;}const ll=L.latLng(pos.coords.latitude,pos.coords.longitude);reportMap.setView(ll,17);updatePoint(ll);say('已取得目前位置，請確認標記是否位於實際觀察處。');},()=>say('無法取得定位。請允許定位權限，或直接在地圖選點。'),{enableHighAccuracy:true,timeout:12000,maximumAge:0});});
 async function shrinkPhoto(file){if(!file.type.startsWith('image/'))throw Error('請選擇圖片檔案。');if(file.size>20*1024*1024)throw Error('照片請勿超過 20 MB。');const bitmap=await createImageBitmap(file);const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('照片處理失敗。')),'image/jpeg',.76));}
 photoInput.addEventListener('change',async()=>{const generation=++photoGeneration;resetPreview();photoBlob=null;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;photoPreview.hidden=true;const file=photoInput.files?.[0];if(!file)return;try{say('正在縮小照片…');const converted=await shrinkPhoto(file);if(generation!==photoGeneration)return;photoBlob=converted;previewUrl=URL.createObjectURL(photoBlob);photoPreview.src=previewUrl;photoPreview.hidden=false;say(`照片已準備好（約 ${Math.round(photoBlob.size/1024)} KB），尚未上傳。`);}catch(e){if(generation!==photoGeneration)return;photoInput.value='';say(e.message);}});
 document.querySelector('#clear-report').addEventListener('click',()=>{photoGeneration++;form.reset();date.value=localDateString();resetPreview();point=null;photoBlob=null;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;photoPreview.hidden=true;if(marker){reportMap.removeLayer(marker);marker=null;}status.textContent='尚未選擇位置';say('');});
 form.addEventListener('submit',e=>{e.preventDefault();resetPreview();if(!form.reportValidity())return;if(!point){say('請先在地圖上選擇實際觀察位置。');return;}currentRecord={schemaVersion:2,status:'pending',source:'citizen_observation_unverified',location:{type:'Point',coordinates:[point.lng,point.lat]},category:document.querySelector('#kind').value,place:document.querySelector('#place').value.trim(),observationDate:date.value,shadeObservation:document.querySelector('#shade').value,description:document.querySelector('#detail').value.trim()};const heading=document.createElement('h3');heading.textContent='回報預覽（尚未送出）';out.append(heading);for(const [label,value] of [['座標',point.lat+', '+point.lng],['類型',currentRecord.category],['日期',currentRecord.observationDate],['遮蔭',currentRecord.shadeObservation],['補充地點',currentRecord.place||'未填'],['其他說明',currentRecord.description||'未填'],['照片',photoBlob?'已選擇':'未選擇']]){const row=document.createElement('p'),b=document.createElement('strong');b.textContent=label+'：';row.append(b,document.createTextNode(value));out.append(row);}const download=document.createElement('button');download.type='button';download.className='btn';download.textContent='下載 JSON 草稿（不含照片）';download.addEventListener('click',()=>{const blob=new Blob([JSON.stringify({...currentRecord,status:'draft_unsubmitted'},null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='coolcity-report-draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});const advanced=document.createElement('details');const summary=document.createElement('summary');summary.textContent='其他選項';advanced.append(summary,download);out.append(advanced);submitBtn.disabled=!currentUser;submitBtn.hidden=!currentUser;say('確認資料後即可送出回報。');});
 document.querySelector('#submit-report').addEventListener('click',async()=>{if(!currentRecord||!currentUser||!cloud)return;say('正在送出回報…');submitBtn.disabled=true;try{await cloud.saveReport(currentRecord,photoBlob,progress=>{if(progress.stage==='upload')say(`正在上傳照片… ${progress.percent}%`);else if(progress.stage==='database')say('照片上傳完成，正在儲存回報資料…');});say('已收到回報，正在等待審核。');currentRecord=null;submitBtn.hidden=true;out.replaceChildren();}catch(e){console.error('回報送出失敗',e.code,e);const code=e.code||'';const detail=code==='storage/unauthorized'?'照片上傳遭 Firebase Storage 拒絕，請檢查 Storage Rules。':code==='storage/upload-stalled'?e.message:code==='permission-denied'?'Firestore 權限不足，請檢查 Firestore Rules。':code==='storage/quota-exceeded'?'照片儲存空間額度不足。':code==='storage/retry-limit-exceeded'?'照片上傳逾時，請檢查網路。':`回報未送出：${code||e.message||'未知錯誤'}`;say(detail);submitBtn.disabled=false;}});
 try{cloud=await loadFirebase();cloud.watchAuth(user=>{currentUser=user;document.querySelector('#auth-status').textContent=user?`已登入：${user.displayName||user.email||'Google 使用者'}`:'尚未登入';document.querySelector('#google-login').hidden=!!user;document.querySelector('#google-logout').hidden=!user;submitBtn.hidden=!user;submitBtn.disabled=!user||!currentRecord;});document.querySelector('#google-login').addEventListener('click',async()=>{try{await cloud.loginGoogle();}catch(e){say('Google 登入失敗：'+(e.code||e.message)+'。請檢查 Firebase 授權網域與登入方式。');}});document.querySelector('#google-logout').addEventListener('click',()=>cloud.logout());}catch(e){document.querySelector('#auth-status').textContent='Firebase SDK 無法載入，僅能使用本機草稿。';say(e.message);}

}

// Walking directions are road-network geometry, not shade scoring.
function initWalk(){
 const el=document.getElementById('route-map');if(!el||!window.L)return;
 const map=L.map(el).setView([24.9438,121.3735],15);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
 const startEl=document.getElementById('route-start'),endEl=document.getElementById('route-end');
 const status=document.getElementById('route-status'),summary=document.getElementById('route-summary');
 let start=null,end=null,routeLayer=null,markers=[];
 const read=(sel)=>sel.value==='custom'?null:sel.value.split(',').map(Number);
 function markerRefresh(){markers.forEach(m=>map.removeLayer(m));markers=[];if(start)markers.push(L.marker(start,{draggable:true}).addTo(map).bindTooltip('起點').on('dragend',e=>{start=[e.target.getLatLng().lat,e.target.getLatLng().lng];startEl.value='custom';}));if(end)markers.push(L.marker(end,{draggable:true}).addTo(map).bindTooltip('終點').on('dragend',e=>{end=[e.target.getLatLng().lat,e.target.getLatLng().lng];endEl.value='custom';}));}
 startEl.addEventListener('change',()=>{start=read(startEl);markerRefresh();});endEl.addEventListener('change',()=>{end=read(endEl);markerRefresh();});
 start=read(startEl);end=read(endEl);markerRefresh();
 let next='start';map.on('click',e=>{const pos=[e.latlng.lat,e.latlng.lng];if(next==='start'){start=pos;startEl.value='custom';next='end';status.textContent='起點已選好，再點地圖選終點。';}else{end=pos;endEl.value='custom';next='start';status.textContent='起點與終點已選好，按「查看步行路線」。';}markerRefresh();});
 document.getElementById('route-gps').addEventListener('click',()=>{if(!navigator.geolocation){status.textContent='這個裝置無法取得位置。';return;}status.textContent='正在取得位置…';navigator.geolocation.getCurrentPosition(p=>{start=[p.coords.latitude,p.coords.longitude];startEl.value='custom';markerRefresh();map.setView(start,16);status.textContent='已取得位置，請確認起點標記。';},()=>status.textContent='無法取得位置，請允許定位或直接在地圖選擇。',{enableHighAccuracy:true,timeout:12000});});
 document.getElementById('route-go').addEventListener('click',async()=>{if(!start||!end){status.textContent='請先選好起點和終點。';return;}status.textContent='正在規劃步行路線…';summary.replaceChildren();try{
 const url=`https://routing.openstreetmap.de/routed-foot/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=false`;
 const response=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('路線服務暫時無法使用');const data=await response.json();const route=data.routes?.[0];if(!route?.geometry?.coordinates?.length)throw Error('找不到可步行的路線');
 if(routeLayer)map.removeLayer(routeLayer);routeLayer=L.geoJSON(route.geometry,{style:{color:'#7253c8',weight:6,opacity:.85}}).addTo(map);map.fitBounds(routeLayer.getBounds(),{padding:[25,25]});const km=(route.distance/1000).toFixed(2),mins=Math.max(1,Math.round(route.duration/60));summary.textContent=`路線約 ${km} 公里・步行約 ${mins} 分鐘（路網估計）`;status.textContent='路線已顯示。紫色線條是步行路線，不代表沿途都有樹蔭。';
 }catch(err){status.textContent='目前無法取得路線：'+err.message+'。可稍後再試，或先查看地圖。';}});
 setTimeout(()=>map.invalidateSize(),150);
}

// Weather is fetched only after explicit action. Never store precise coordinates.
const WEATHER_CITIES={"臺北市":[25.033,121.565],"新北市":[25.012,121.465],"基隆市":[25.128,121.741],"桃園市":[24.993,121.301],"新竹市":[24.804,120.972],"新竹縣":[24.838,121.018],"苗栗縣":[24.564,120.821],"臺中市":[24.148,120.674],"彰化縣":[24.076,120.54],"南投縣":[23.916,120.684],"雲林縣":[23.71,120.542],"嘉義市":[23.48,120.45],"嘉義縣":[23.459,120.294],"臺南市":[22.999,120.227],"高雄市":[22.627,120.301],"屏東縣":[22.672,120.488],"宜蘭縣":[24.757,121.753],"花蓮縣":[23.987,121.601],"臺東縣":[22.755,121.15],"澎湖縣":[23.569,119.566],"金門縣":[24.432,118.318],"連江縣":[26.16,119.95]};
function initWeather(){
 const temp=document.getElementById('weather-temp'),meta=document.getElementById('weather-meta'),strip=document.getElementById('weather-strip'),county=document.getElementById('weather-city'),district=document.getElementById('weather-district'),search=document.getElementById('weather-search'),btn=document.getElementById('weather-locate'),help=document.getElementById('weather-help');
 if(!temp||!county||!district||!search)return;
 for(const city of Object.keys(WEATHER_CITIES)){const o=document.createElement('option');o.value=city;o.textContent=city;county.append(o);}
 let serial=0;
 async function load(lat,lon,label){const id=++serial;strip.hidden=false;temp.textContent='…';meta.textContent='正在取得氣溫';
   try{const u=new URL('https://api.open-meteo.com/v1/forecast');u.search=new URLSearchParams({latitude:String(lat),longitude:String(lon),current:'temperature_2m',timezone:'Asia/Taipei'});
     const res=await fetch(u,{signal:AbortSignal.timeout(12000)});if(!res.ok)throw Error('取得失敗');
     const data=await res.json(),value=Number(data.current?.temperature_2m);
     if(!Number.isFinite(value)||value< -30||value>55)throw Error('資料異常');if(id!==serial)return;
     temp.textContent=value.toFixed(1)+'°C';meta.textContent=label+' · '+String(data.current.time||'').replace('T',' ')+' · Open-Meteo 模式氣溫';
   }catch(e){if(id!==serial)return;temp.textContent='--°C';meta.textContent='暫時無法取得氣溫，請稍後重試。';}
 }
 county.addEventListener('change',()=>{district.replaceChildren(new Option('選擇行政區',''));for(const name of (TAIWAN_DISTRICTS[county.value]||[])){district.add(new Option(name,name));}district.disabled=!county.value;search.disabled=true;help.textContent='選好行政區後，按「查詢氣溫」。';});
 district.addEventListener('change',()=>{search.disabled=!district.value;});
 search.addEventListener('click',async()=>{
   if(!county.value||!district.value)return;
   const city=county.value,town=district.value;
   search.disabled=true;help.textContent=`正在查找 ${city}${town} 的代表位置…`;
   try{
     // Open-Meteo's public geocoder is used to resolve the district name, not user GPS.
     const queries=[city+town,town+' '+city];let found=null;
     for(const name of queries){
       const u=new URL('https://geocoding-api.open-meteo.com/v1/search');u.search=new URLSearchParams({name,count:'10',language:'zh',countryCode:'TW'});
       const response=await fetch(u,{signal:AbortSignal.timeout(10000)});if(!response.ok)continue;
       const data=await response.json();
       found=(data.results||[]).find(r=>Number.isFinite(r.latitude)&&Number.isFinite(r.longitude)&&(String(r.name||'').includes(town)||String(r.admin2||'').includes(town)||String(r.admin3||'').includes(town)));
       if(found)break;
     }
     if(!found){help.textContent='查無這個行政區的可靠代表座標，請改用目前位置查詢；不會以縣市氣溫冒充行政區氣溫。';return;}
     help.textContent='以行政區代表位置查詢，可能與實際所在地有差異。';
     await load(found.latitude,found.longitude,city+town+'附近');
   }catch(e){help.textContent='行政區位置查詢暫時無法使用，可改用目前位置。';}finally{search.disabled=false;}
 });
 btn.addEventListener('click',()=>{
   if(!navigator.geolocation){help.textContent='裝置不支援定位，可改選行政區。';return;}
   help.textContent='正在取得位置…';
   navigator.geolocation.getCurrentPosition(pos=>{county.value='';district.replaceChildren(new Option('選擇行政區',''));district.disabled=true;search.disabled=true;help.textContent='已取得位置。';load(pos.coords.latitude,pos.coords.longitude,'目前位置附近');},()=>{help.textContent='無法取得位置，可改選行政區查詢。';},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
 });
}
// Native on-site chat. Gemini credentials stay exclusively in Firebase Secret Manager.
function initSeedling(){
 const wrap=document.createElement('section');wrap.className='seedling';
 wrap.innerHTML=`<button class="seedling-toggle" type="button" aria-expanded="false" aria-controls="seedling-panel">🌱 小樹苗</button><section class="seedling-panel" id="seedling-panel" role="dialog" aria-label="小樹苗 AI 對話" hidden><div class="seedling-head"><strong>🌱 小樹苗 <small>CoolCity AI 小幫手</small></strong><button type="button" aria-label="關閉小樹苗">×</button></div><div class="seedling-messages" id="seedling-messages" role="log" aria-live="polite"><p class="seedling-bubble bot">嗨！我是小樹苗 🌱 想了解 CoolCity 或其他問題，都可以問我！</p></div><form class="seedling-compose" id="seedling-form"><label class="sr-only" for="seedling-input">輸入訊息</label><input id="seedling-input" maxlength="1500" placeholder="輸入訊息…" autocomplete="off" required><button type="submit">送出</button></form><p class="seedling-state" id="seedling-state" role="status"></p></section>`;
 document.body.append(wrap);
 const toggle=wrap.querySelector('.seedling-toggle'),panel=wrap.querySelector('.seedling-panel'),close=wrap.querySelector('.seedling-head button'),state=wrap.querySelector('#seedling-state'),messages=wrap.querySelector('#seedling-messages'),form=wrap.querySelector('#seedling-form'),input=wrap.querySelector('#seedling-input'),send=form.querySelector('button');
 let cloud=null,busy=false,history=[];
 const bubble=(text,role)=>{const p=document.createElement('p');p.className='seedling-bubble '+role;p.textContent=text;messages.append(p);messages.scrollTop=messages.scrollHeight;return p;};
 const hide=()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus();};
 toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)input.focus();});close.addEventListener('click',hide);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)hide();});
 form.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const question=input.value.trim();if(!question)return;if(question.length>1500){state.textContent='訊息過長。';return;}
 busy=true;send.disabled=true;input.disabled=true;input.value='';state.textContent='小樹苗正在思考…';bubble(question,'user');
 try{cloud??=await loadFirebase();if(!cloud.authInstance.currentUser){state.textContent='請先到會員中心登入，再使用小樹苗。';return;}
 const result=await cloud.chatWithSeedling(question,history);const answer=result?.answer;if(typeof answer!=='string'||!answer.trim())throw Error('AI 未回傳文字');bubble(answer,'bot');history=[...history,{role:'user',text:question},{role:'model',text:answer}].slice(-10);state.textContent='';
 }catch(err){console.error('小樹苗回覆失敗',err);state.textContent=err.code==='functions/unauthenticated'?'請先到會員中心登入。':err.code==='functions/resource-exhausted'?'今日使用額度已達上限，請明天再試。':err.code==='functions/unavailable'?'AI 服務目前無法使用，請稍後再試。':err.code==='functions/deadline-exceeded'?'AI 回應逾時，請稍後再試。':'暫時無法取得回覆，請稍後再試。';}finally{busy=false;send.disabled=false;input.disabled=false;input.focus();}
 });
}
initSeedling();
// Boot after all module-level constants and handlers have initialized.
render();
