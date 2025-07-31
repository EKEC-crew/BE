/**
 * **[Image]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToGetImage***
 * '이미지 로드'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} query
 * @returns {Object}
 */
export const bodyToGetImage = (query) => {
  return {
    type: parseInt(query.type),
    fileName: query.fileName,
  };
};
