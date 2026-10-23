import {services} from './services.js';
const app=document.querySelector('#app');const nav=document.querySelector('#nav');const menu=document.querySelector('#menu');
const intro=(label,title,description)=>`<span class="eyebrow">${label}</span><h1 class="section-title">${title}</h1><p class="lead">${description}</p>`;
const card=(num,title,desc,route)=>`<article class="card"><span class="number">${num}</span><h3>${title}</h3><p>${desc}</p><a class="textlink" href="#${route}">前往查看 ↗</a></article>`;
const pages={
 home:()=>`<section class="hero"><div class="eyebrow">TANJI · CLIMATE ADAPTATION</div><h1>查詢道路資料，<br>回報實際步行環境。</h1><p>CoolCity 第一階段提供北大特區與臺北大學三峽校區周邊的道路地圖，後續將加入現場觀察回報與資料驗證。</p><div class="actions"><a class="btn primary" href="#map">探索綠蔭地圖 ↗</a><a class="btn secondary" href="#report">了解綠蔭回報 ↗</a></div></section><section class="container">${intro('PLATFORM FEATURES','從觀察到分析','平台將逐步整合地圖資料、民眾回報與分析工具。以下功能目前處於開發階段。')}<div class="cards">${card('01','綠蔭地圖','檢視街道與步行空間的遮蔭資訊，未來串接地圖與環境資料。','map')}${card('02','綠蔭回報','記錄遮蔭不足、樹木變動及其他現地觀察，建立可審核的資料流程。','report')}${card('03','調適分析','比較區域需求，逐步導入可解釋的指標與 AI 輔助整理。','analysis')}${card('04','步行探索','透過路線與定點任務，鼓勵民眾認識周邊步行環境。','walk')}${card('05','會員中心','未來管理個人回報、參與紀錄及資料權限。','account')}</div><div class="notice">目前為網站架構測試版。尚未提供真實遮蔭測量、AI 分析、會員登入或資料提交服務。</div></section>`,
 map:()=>`<section class="container">${intro('SHADE MAP','綠蔭地圖','查看北大特區及臺北大學三峽校區周邊的道路、步道資料。點選地圖線段可查看名稱及資料來源；目前尚未建立遮蔭分級。')}<div class="map-layout"><div><p class="map-guide"><strong>操作方式</strong>拖曳地圖移動位置，使用左上角 ＋／－ 縮放，點選彩色道路線段查看資訊。</p><div id="coolcity-map" role="application" aria-label="北大特區道路互動地圖"></div><div class="map-legend"><span><i></i>道路線段</span><span class="ped"><i></i>步道／行人相關線段</span></div><p class="muted">線段類型不代表現場人行道完整或具有遮蔭。地圖底圖 © OpenStreetMap contributors。</p></div><aside class="panel"><h3>道路資訊</h3><div id="road-detail"><p class="muted">請點選地圖中的線段。</p></div><hr><h3>資料說明</h3><p class="muted">道路：OpenStreetMap／Geofabrik（2026-10-22 匯出）。行道樹：新北市政府道路層級統計。政府統計未必與地圖線段完全對應。</p><p class="muted">本版未啟用照片上傳、回報儲存或遮蔭預測。</p></aside></div></section>`,
 report:()=>`<section class="container">${intro('CITIZEN REPORT','綠蔭回報','規劃讓民眾回報遮蔭不足、樹木修剪或移除，以及現地環境變化。正式開放前會建立會員驗證、資料審核與隱私規範。')}<div class="two"><section class="panel"><h3>回報介面預覽</h3><form id="report-form" class="form"><div class="field"><label for="kind">回報類型</label><select id="kind" required><option>遮蔭不足</option><option>樹木修剪或移除</option><option>颱風後環境變化</option><option>其他觀察</option></select></div><div class="field"><label for="place">地點描述</label><input id="place" placeholder="例如：某路口的人行道" required></div><div class="field"><label for="detail">現地觀察</label><textarea id="detail" placeholder="請描述觀察到的情況" required></textarea></div><button class="btn primary" type="submit" disabled>尚未開放送出</button></form><p class="muted">本表單僅展示欄位，不會儲存或傳送任何資料。</p></section><aside class="panel"><h3>正式開放前的必要措施</h3><ul class="list"><li>Firebase 會員驗證及存取規則</li><li>照片上傳限制與隱私提醒</li><li>地點資訊與個資最小化</li><li>回報審核及不當內容處理</li><li>回報狀態與歷史紀錄</li></ul></aside></div></section>`,
 analysis:()=>`<section class="container">${intro('ADAPTATION ANALYSIS','調適分析','未來以資料來源清楚、可重現的指標比較步行環境的遮蔭需求，並讓 AI 協助整理資訊，而非取代實地驗證。')}<div class="cards">${card('01','區域比較','依資料可得性比較不同街道或區域的遮蔭條件。','map')}${card('02','回報彙整','將已審核的民眾回報分類，觀察重複出現的問題。','report')}${card('03','改善優先序','逐步建立明確的評估準則，避免以單一指標推論。','analysis')}</div><div class="notice">AI 分析服務尚未啟用。未來的分析結果須標示資料來源、時間、方法及不確定性。</div></section>`,
 walk:()=>`<section class="container">${intro('WALK & EXPLORE','步行探索','規劃以路線介紹與定點參與任務，協助民眾觀察日常步行環境。')}<div class="two"><div class="panel"><h3>預計功能</h3><ul class="list"><li>探索路線與沿途綠蔭資訊</li><li>定點任務與完成紀錄</li><li>個人參與歷程</li></ul></div><div class="panel"><h3>定位與隱私</h3><p class="muted">優先採用使用者主動授權的定點簽到，不預設持續追蹤位置。功能尚未開放。</p></div></div></section>`,
 account:()=>`<section class="container">${intro('ACCOUNT','會員中心','未來使用 Firebase Authentication 提供會員登入，並管理個人回報及參與紀錄。')}<div class="panel"><h3>會員系統尚未啟用</h3><p class="muted">登入方式、帳號權限、資料保存與刪除機制將在 Firebase 設定完成後實作。</p><button class="btn" disabled>登入功能開發中</button></div></section>`
};
function render(){const page=location.hash.replace('#','')||'home';app.innerHTML=(pages[page]||pages.home)();document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.page===page));nav.classList.remove('open');menu.setAttribute('aria-expanded','false');document.title=`${page==='home'?'CoolCity':({map:'綠蔭地圖',report:'綠蔭回報',analysis:'調適分析',walk:'步行探索',account:'會員中心'}[page]||'CoolCity')}｜CoolCity`;window.scrollTo({top:0,behavior:'instant'});if(page==='map')initMap();}menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});window.addEventListener('hashchange',render);render();

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
 requestAnimationFrame(()=>map.invalidateSize({pan:false}));
 setTimeout(()=>map.invalidateSize({pan:false}),250);
}
