/**
 * **[Crew Search]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromGetImage***
 * '이미지 로드'기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromGetImage = (data) => {
  return {
    url: data.imageUrl,
  };
};
