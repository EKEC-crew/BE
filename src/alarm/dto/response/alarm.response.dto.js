/**
 * **[Alarm]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromGetAlarms***
 * '알람 목록 조회' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromGetAlarms = (data) => {
  return {
    alarms: data.alarms,
    count: data.count,
  };
};
/**
 * **[Alarm]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromReadAlarm***
 * '알람 읽음 처리' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromReadAlarm = (data) => {
  return {
    id: data.alarmId,
  };
};
