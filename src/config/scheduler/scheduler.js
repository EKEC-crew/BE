import { schedulerTasks } from "../../auth/scheduler/auth.scheduler.js";
/**
 * **\<🛠️ Config\>**
 * ***initSchedulers***
 * 스케줄러 초기화 함수입니다.
 */
export const initSchedulers = () => {
  console.log("[SYSTEM] 스케줄러 초기화 중...");
  schedulerTasks();
};
