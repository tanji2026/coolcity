// 所有外部資料與 AI 呼叫集中在此。正式環境請透過後端 API，勿將私密金鑰放在前端。
export const services = {
  async submitReport(data) { throw new Error('綠蔭回報尚未啟用；請先設定 Firebase 與後端權限。'); },
  async loadShadeData() { return { status:'not-configured', features:[] }; },
  async requestAIAnalysis(payload) { throw new Error('AI 分析尚未啟用；未設定後端 API。'); },
  async getCurrentUser() { return null; }
};
