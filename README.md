# CoolCity v5 — 手機拍照與定位回報

部署：將 ZIP **內的檔案**上傳至 `tanji2026/coolcity` 根目錄，保留 `assets/` 結構。網址：https://tanji.tw/coolcity/#report

## 已實作
- 手機相機／相簿選擇照片，瀏覽器內縮圖壓縮（長邊不超過 1600px，JPEG 品質 0.76），預覽照片
- GPS 定位（須授權且 HTTPS）／地圖點選／拖曳標記；座標為每筆回報主鍵資訊，不要求文字地址
- 制式類型、遮蔭選項，日期；地點補充與說明選填
- 本機回報預覽、下載 JSON 草稿（不含照片）
- Google 登入與登出、Firestore+Storage 正式送出程式（需 Firebase 設定完成）
- 原有道路地圖保持不變；沒有 AI 圖片判讀、遮蔭評分、公開回報瀏覽或管理者審核 UI

## Firebase Console 必做
1. Authentication → Sign-in method → Google 啟用。
2. Authentication → Settings → Authorized domains 加入 `tanji.tw`；若使用 GitHub Pages 原生網址，另加對應網域。
3. Firestore Database 建立資料庫；到 Rules 貼上 `firestore.rules` 內容並發佈。
4. Cloud Storage：需符合 Firebase 當前計費方案要求，開啟 Storage 後到 Rules 貼上 `storage.rules` 並發佈。**若尚未啟用 Storage，請先測試拍照、定位與草稿，正式送出會失敗。**
5. 安全規則為第一階段最小規則範例；正式公開前應加入 App Check、濫用防護、速率限制與完整管理者流程。

## 資料與安全
- 每筆回報存入 Firestore `reports/{reportId}`；照片存入 Storage `reports/{uid}/{reportId}/photo.jpg`。
- 每筆為待確認點位，不代表該道路或區域已確認遮蔭狀態。
- 前端 `firebaseConfig` 是 Firebase 公開 Web 設定，不是 Gemini API 密鑰。不要將私密金鑰或管理員憑證放進 GitHub。
- 目前照片上傳先於 Firestore 寫入；若 Firestore 寫入失敗，可能殘留尚未對應回報的 Storage 照片。正式公開前應加入後端清理機制。
- 使用者的 GPS 與照片僅在其主動操作後處理。正式公開前需補充隱私告知、照片保存及刪除政策。
