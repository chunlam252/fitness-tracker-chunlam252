
import { ExerciseLog } from "../types";

// 移除所有外部 AI 依賴，防止 Crash
export const aiService = {
  getCoachAdvice: async (logs: ExerciseLog[]) => {
    return "AI 功能已停用";
  }
};
