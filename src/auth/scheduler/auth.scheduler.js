import cron from "node-cron";
import {
  cleanExpiredRefreshTokens,
  cleanUncompletedUsers,
} from "../service/auth.service.js";
/**
 * **[Auth]**
 * **\<⏰ Scheduler\>**
 * ***schedulerTasks***
 * 스케줄러 테스크를 등록합니다.
 */
export const schedulerTasks = () => {
  // 매일 자정마다 만료된 리프레시 토큰을 삭제합니다.
  cron.schedule("0 0 * * *", async () => {
    console.log("[SYSTEM] 만료된 리프레시 토큰 검사 및 삭제 중...");
    try {
      await cleanExpiredRefreshTokens();
    } catch (error) {
      console.error("[SYSTEM] 리프레시 토큰 검사 및 삭제 중 오류 발생:", error);
    }
  });
  // 매일 자정마다 가입이 완료되지 않은 사용자를 삭제합니다.
  cron.schedule("0 0 * * *", async () => {
    console.log("[SYSTEM] 가입 미완료 사용자 정리중...");
    try {
      await cleanUncompletedUsers();
    } catch (error) {
      console.error("[SYSTEM] 가입 미완료 사용자 정리 중 오류 발생:", error);
    }
  });
};
