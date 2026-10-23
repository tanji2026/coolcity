# CoolCity 2.0｜正式前端與規則整合版

## 已完成與已知限制
- 網站原生右下角「小樹苗」對話框，呼叫已部署於 `asia-east1` 的 `chatWithSeedling`；必須先登入。Gemini 金鑰僅存在 Firebase Secret Manager。
- Google／Email 會員登入、密碼重設、回報表單、照片上傳、我的回報、管理員審核的前端程式已接線。
- 位置氣溫：Open-Meteo 模式氣溫，**不是中央氣象署實測資料**；須按定位或手動選縣市。
- 路線：北大特區示範路網路線，**不是遮蔭最佳化路線**。
- 管理員審核必須另外由可信任的 Firebase Admin SDK 設定 `admin: true` 自訂宣告；沒有宣告時不會顯示審核介面。
- 未在你的正式 Firebase 帳戶完成登入、寫入、Storage、Gemini 對話端對端驗收，不能保證全部功能已在正式站運作。

## 最少部署步驟
1. **先備份 GitHub 目前的 `index.html` 與 `assets/`**。
2. 將本包根目錄的 `index.html` 和 `assets/` 上傳覆蓋到 `tanji2026/coolcity` 的 `main` 根目錄；其他 Firebase 檔案**不要上傳到 GitHub**。
3. 你已部署 `chatWithSeedling` 並建立 `GEMINI_API_KEY`，**無需重新部署 Function 或重設金鑰**。
4. 回報寫入和照片上傳還需要發布 Firestore/Storage 規則。先在 Firebase Console **備份目前線上規則**，確認本包規則不會刪除其他集合的必要權限，再於本包根目錄執行：
   `firebase deploy --only firestore:rules,storage --project coolcity-54b1f`
   **注意：這會覆蓋目前線上 Firestore 與 Storage 規則**。若已有其他規則，必須先合併，不能直接覆蓋。
5. 驗收 Google 登入、電子郵件登入、AI 問答、回報照片、我的回報、管理員審核、手機版。

## 安全注意
- Storage 僅允許登入者上傳自己目錄內的 JPEG/PNG/WebP（5MB 以內），並允許本人刪除自己的照片以清理失敗上傳。
- AI 每會員每日 20 次、全站每日 500 次；App Check 尚未強制啟用，公開使用前應另行驗證及啟用。
- 請不要將 Gemini API Key、服務帳戶 JSON、`.env` 上傳 GitHub。
