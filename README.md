# CoolCity 2.0 核心功能整合版

## 部署（覆蓋正式網站）
將 `index.html`、`assets/` 更新到 GitHub 儲存庫根目錄。**GitHub 舊文件需要在儲存庫另外刪除，覆蓋不會自動刪除。**

Firebase Console → Firestore Database → 規則：將 `firestore.rules` 內容貼上並發布，否則文字回報無法送出。部署規則前請確認目前沒有其他應用依賴舊規則。

Apps Script → `Chat.html`：把本包 `AppsScript_Chat.html` 內容覆蓋原 Chat HTML，儲存後到「部署 → 管理部署作業 → 編輯 → 新版本 → 部署」。這是**必要步驟**，否則小樹苗 iframe 不會取得 CoolCity 登入狀態。`Code.gs` 和 API Key 不需要變動。

## 已整合
- 小樹苗：右下角聊天 iframe、Firebase 登入 token 傳遞；必須更新 Apps Script HTML 才能啟用。
- 全臺氣溫：使用者主動授權定位，或手動選擇 22 縣市。Open-Meteo 模式氣溫，**不是中央氣象署測站實測值**。未自動取得或儲存定位。
- Firebase 電子郵件／Google 登入；會員中心查看自己的文字回報。
- 民眾回報：文字、位置與遮蔭觀察送 Firestore，初始狀態 pending；不含照片。

## 尚未完成或需部署環境驗證
- 中央氣象署測站資料代理（仍需安全部署後端）；照片上傳安全服務；管理員審核 UI；跨站小樹苗對話實測與 Google iframe 相容性；真正綠蔭評分路線。
- Apps Script 每日額度是基礎限制，不等於不可突破的帳單上限。請設定 API 用量與預算警示。
- Firebase API key 是公開 Web 設定，Gemini API key 只能留在 Apps Script Properties。
