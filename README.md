# CoolCity 2.0｜小樹苗對話框修正版

## 更新內容
- 右下角「小樹苗」改為網站內浮動對話框，不再跳轉新分頁。
- 對話框開啟後透過 `postMessage` 傳遞當前 Firebase 會員的 ID Token，Apps Script 後端仍負責驗證會員身分。
- 後端 `doGet()` 加上 `setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)`，允許 Google Apps Script 頁面被嵌入。此設定僅解除框架限制，不代表 AI 一定可用，仍需檢查實際 Google 部署與瀏覽器限制。
- 「我的回報」失敗時顯示清楚的提示。尚未證實資料庫查詢正常；需檢查 Firestore 規則、資料及瀏覽器主控台錯誤。

## 更新順序
1. GitHub 上傳根目錄 `index.html` 和 `assets/`、`firestore.rules`（如果規則未改，不必重新發布）。
2. Apps Script `Code.gs` 用 `AppsScript_Code.gs` 更新，`Chat.html` 用 `AppsScript_Chat.html` 更新。
3. Apps Script「部署 → 管理部署作業 → 編輯 → 新版本 → 部署」，保留原部署網址。
4. 會員登入後在 CoolCity 右下角開啟小樹苗對話框。

## 限制
Google Apps Script 的 iframe 可能受 Google 端登入／瀏覽器第三方 Cookie 或安全政策限制，不能保證在所有瀏覽器運作。未完成跨網域實測。若仍顯示 Google 錯誤頁，須改為不同後端架構，不應繼續以 iframe 假裝已完成。
