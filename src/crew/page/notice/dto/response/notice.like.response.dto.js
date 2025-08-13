/**
 * 공지사항 좋아요 응답 DTO
 */

/**
 * 좋아요 토글 응답 DTO
 * @param {boolean} isLiked - 현재 사용자의 좋아요 상태
 * @param {number} totalLikes - 총 좋아요 수
 * @param {string} action - 수행된 액션 (added/removed)
 * @param {Array} likedBy - 좋아요를 누른 사용자 정보 배열
 * @returns {Object} 응답 데이터
 */
export const noticeLikeToggleResponseDto = (
  isLiked,
  totalLikes,
  action,
  likedBy
) => {
  const actionMessage =
    action === "added"
      ? "좋아요가 추가되었습니다."
      : "좋아요가 취소되었습니다.";

  return {
    isLiked,
    totalLikes,
    action,
    likedBy: likedBy.map((like) => ({
      crewMemberId: like.crewMemberId,
      likedAt: like.createdAt,
    })),
    message: actionMessage,
  };
};

/**
 * 좋아요 에러 응답 DTO
 * @param {string} errorCode - 에러 코드
 * @param {string} reason - 에러 이유
 * @returns {Object} 에러 응답 데이터
 */
export const noticeLikeErrorResponseDto = (errorCode, reason) => {
  return {
    errorCode,
    reason,
    data: null,
  };
};
