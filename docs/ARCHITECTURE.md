# CoolCity 技術架構與分階段計畫

## 已實作（第一版）
- GitHub Pages 靜態前端；相對路徑可在 `https://tanji.tw/coolcity/` 運作。
- 六個功能頁面的可用導覽與響應式介面。
- `assets/js/services.js` 作為後續資料、AI、Firebase 的服務層介面；**目前未連線**。
- 尚未開放的功能有明確標示，不展示虛構測量或 AI 結果。

## 後續建議
1. 建立獨立 Firebase 專案，設定 Auth、Firestore、Storage、App Check 與安全規則；建立開發／正式環境。
2. 先定義資料模型：`users`、`reports`、`reportReviews`、`shadeFeatures`、`walkTasks`、`checkIns`、`analysisRuns`；審核及公開資料分離。
3. Firebase Cloud Functions（或 Cloud Run）承接需要保密的外部 API 與 AI 呼叫，使用 Secret Manager 管理金鑰，加入驗證、速率限制、成本預算、日誌。
4. 地圖選擇供應商後，核對授權、費用與 API key 的來源限制；遮蔭資料需要實際資料來源、測量方法與時間戳記。
5. AI 先用於已授權資料的分類與摘要；設計人工複核、提示詞注入防護、個資遮蔽及結果來源標示。
6. 民眾照片與定位資訊須有告知、最小蒐集、內容審核、保存與刪除流程；避免未經同意公開精確位置。

## 安全注意
- GitHub Pages 前端檔案是公開的，**不要**把 AI API Key、服務帳號私鑰或管理憑證寫在 HTML/JS 或提交 Git。
- Firebase 網頁設定物件通常不是機密，但必須依靠 Firestore/Storage Security Rules、Auth 與 App Check 等控管存取。
- 本版本沒有實際 Firebase 設定、AI 呼叫、真實地圖資料或可提交的回報表單。
