# CoolCity

TanJi 碳吉的都市高溫調適與綠蔭規劃平台（第一版網站架構）。

## 部署
把此資料夾中的 `index.html`、`assets/`、`docs/`、`README.md` 上傳到 GitHub 儲存庫 `tanji2026/coolcity` 的根目錄。於 Settings → Pages 選擇 Deploy from a branch、`main`、`/(root)`。若帳號主網站的 `tanji.tw` 已正確設定自訂網域，專案網址預期為 `https://tanji.tw/coolcity/`。

## 本版功能
首頁、綠蔭地圖、綠蔭回報、調適分析、步行探索、會員中心的介面與導覽。尚未串接 Firebase、地圖或 AI API；回報表單不會提交資料。

## 開發
直接開啟 `index.html` 可能因瀏覽器對 ES Modules 的本機檔案限制而失敗。可在專案目錄執行 `python3 -m http.server 8000`，再瀏覽 `http://localhost:8000/`。

詳見 `docs/ARCHITECTURE.md`。


## v2 地圖更新
新增 Leaflet 道路互動地圖及 assets/data/roads.geojson。將 ZIP 內全部檔案維持目錄結構上傳 GitHub。底圖使用 OSM 公共圖磚（正式大量流量部署前需評估圖磚政策）。道路資料 © OpenStreetMap contributors，依 ODbL 授權。資料不表示遮蔭或人行道現況已確認。


## v3 地圖修正（2026-10-23）
- 修正地圖圖磚散落問題：補齊 Leaflet 必要定位、圖層、控制項 CSS，避免遠端 CSS 載入失敗時地圖崩壞。
- 地圖容器加上 `position: relative`、`overflow: hidden`、適當高度與響應式版型。
- 啟用滾輪縮放，保留 ＋／－ 按鈕，加入操作說明及圖例。
- 地圖初始化後重新計算容器尺寸。
- 原始 GeoJSON 與行道樹統計未更動；沒有新增遮蔭判定。
- 請將 ZIP **內的檔案**上傳到 `tanji2026/coolcity` 儲存庫根目錄，覆蓋同名檔案，保留資料夾層級。
- 驗收：地圖拼接完整、縮放控制可見、可拖曳、點選道路可在右側顯示資訊。
