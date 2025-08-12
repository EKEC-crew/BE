/**
 * **[Alarm]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToGetAlarms***
 * '알림 목록 조회' 기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} payload
 * @param {Object} query
 * @returns {Object}
 */
export const bodyToGetAlarms = (payload, query) => {
  return {
    userId: payload.id,
    page: query.page || 1,
  };
};
/**
 * **[Alarm]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToReadAlarm***
 * '알림 읽음 처리' 기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} payload
 * @param {Object} params
 * @returns {Object}
 */
export const bodyToReadAlarm = (payload, params) => {
  return {
    userId: payload.id,
    alarmId: parseInt(params.alarmId),
  };
};
