# CoolCity 2.0 — 網站部署說明

將 `index.html`、`assets/` 上傳到 `coolcity` 儲存庫根目錄，覆蓋相同路徑檔案。若儲存庫還有 V5/V6 的舊 README、舊說明檔，請在 GitHub 上另外刪除：上傳 ZIP 不會自動刪除既有檔案。

## 已接通
- Firebase Google 登入／登出
- Firebase 電子郵件註冊、登入、密碼重設、驗證信寄送（須於 Firebase Authentication 啟用電子郵件密碼提供者）
- 首頁即時氣溫：預設 Open-Meteo 北大特區附近的模式氣溫，非中央氣象署測站實測值，也非人行道溫度。
- 地圖、步行路線及現場回報草稿預覽

## 中央氣象署實測串接
CWA Open Data API 需要授權碼，**不要**放入公開 GitHub Pages 程式。若有安全的代理服務，請在 index.html 的 app.js 前加上：
`<script>window.COOLCITY_WEATHER_ENDPOINT='https://YOUR-SECURE-ENDPOINT';</script>`
代理需回傳 JSON：`{ "temperature": 30.2, "station": "測站名稱", "observedAt": "2026-10-24T02:00:00+08:00" }`，並正確設定 CORS。未設定時使用 Open-Meteo。

## 尚需後端才能安全啟用
照片上傳、Gemini「小樹苗」對話、審核後台與回報資料庫寫入。目前前端僅有草稿預覽，不會聲稱已送出。不要把 Gemini 或氣象署金鑰寫進公開檔案。

## 驗證
部署後請測試 Google 登入／登出、電子郵件註冊／驗證／登入／忘記密碼、首頁氣溫顯示、地圖及步行路線。
