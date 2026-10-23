# CoolCity

TanJi 碳吉的都市高溫調適與綠蔭規劃平台（第一版網站架構）。

## 部署
把此資料夾中的 `index.html`、`assets/`、`docs/`、`README.md` 上傳到 GitHub 儲存庫 `tanji2026/coolcity` 的根目錄。於 Settings → Pages 選擇 Deploy from a branch、`main`、`/(root)`。若帳號主網站的 `tanji.tw` 已正確設定自訂網域，專案網址預期為 `https://tanji.tw/coolcity/`。

## 本版功能
首頁、綠蔭地圖、綠蔭回報、調適分析、步行探索、會員中心的介面與導覽。尚未串接 Firebase、地圖或 AI API；回報表單不會提交資料。

## 開發
直接開啟 `index.html` 可能因瀏覽器對 ES Modules 的本機檔案限制而失敗。可在專案目錄執行 `python3 -m http.server 8000`，再瀏覽 `http://localhost:8000/`。

詳見 `docs/ARCHITECTURE.md`。
