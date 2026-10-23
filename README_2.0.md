# CoolCity 2.0 · Dev 01

以先前可載入的 v6 修復版為基底，建立新的開發主線。

## 此次實作
- 首頁使用正式 slogan，不再以單一地區定義平台。
- 路線頁將「北大特區」作為目前示範區域。
- 會員中心使用現有 Firebase Google Authentication，支援登入、顯示目前帳號與登出；必須確認 Firebase Console 已啟用 Google 登入且授權網域包含實際網站網域。
- 氣溫僅在設定 `window.COOLCITY_WEATHER_ENDPOINT` 時顯示真實資料，沒有金鑰或假氣溫。
- 修正手機日期輸入與窄螢幕溢出防護。
- 隱藏尚未可用的正式回報送出按鈕；照片上傳、Gemini 聊天、會員回報列表、管理審核尚未完成。

## 注意
- 不要直接覆蓋目前運作正常的正式站；先部署到獨立測試網址驗收。
- `firebase-client.js` 內 Firebase 網頁設定不是 Gemini 或氣象署的機密 API key。請仍檢查 Firestore / Storage rules。
- 目前的照片提交流程使用 Firebase Storage，不符合希望維持 Spark 免費方案的方向；因此本版沒有啟用提交。後續需實作具驗證的照片服務。
- `assets/data/roads.geojson` 為既有示範資料，不代表綠蔭評分。

## 驗收
1. 首頁與各分頁可載入，手機不產生橫向捲動。
2. 登入會員中心並完成 Google 登入、重新整理後仍能顯示帳號、登出。
3. 路線分頁能開啟地圖；網路服務不可用時仍可切換其他頁。
4. 未設定氣溫服務時不顯示假氣溫。
