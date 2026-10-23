# CoolCity Map v4｜綠蔭回報草稿測試版

正式名稱：都市高溫調適與綠蔭改善決策平台（CoolCity）。

## 本版更新
- 網站英文品牌 CoolCity 為主，旁邊小字顯示正式中文名稱。
- 綠蔭回報頁加入 Leaflet 地圖選點、回報欄位、表單檢查、草稿預覽及 JSON 下載。
- **不會送出、上傳或自動保存回報**。尚未連接 Firebase。
- 綠蔭地圖道路資料及原有道路點選功能不變。

## 部署
將 ZIP 解壓縮後所有檔案與資料夾上傳至 `tanji2026/coolcity` 儲存庫根目錄，覆蓋同名檔案；保留 `assets/data/roads.geojson` 的路徑。GitHub Pages 網址：https://tanji.tw/coolcity/

## 下一步（尚未實作）
Firebase App Check、Firestore 安全規則、身分驗證、圖片儲存與管理者審核，通過測試後才能啟用正式回報提交。
