/**
 * 공지 댓글 응답 DTO
 */

/**
 * 댓글 목록 응답 DTO
 * @param {Array} comments - 댓글 배열
 * @param {string} noticeId - 공지 ID
 * @returns {Object} 응답 데이터
 */
export const commentListResponseDto = (comments, noticeId) => {
  return {
    message: `댓글 목록입니다.`,
    data: comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      modifiedAt: comment.modifiedAt,
      author: comment.crewMember?.user?.nickname || "알 수 없음",
      authorImage: comment.crewMember?.user?.image || null,
    })),
  };
};

/**
 * 댓글 상세 응답 DTO
 * @param {Object} comment - 댓글 데이터
 * @returns {Object} 응답 데이터
 */
export const commentDetailResponseDto = (comment) => {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    modifiedAt: comment.modifiedAt,
    author: {
      nickname: comment.crewMember?.user?.nickname || "알 수 없음",
      image: comment.crewMember?.user?.image || null,
    },
  };
};

/**
 * 댓글 생성 응답 DTO
 * @param {Object} comment - 생성된 댓글 데이터
 * @returns {Object} 응답 데이터
 */
export const commentCreateResponseDto = (comment) => {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    noticeId: comment.crewNoticeId,
    crewMemberId: comment.crewMemberId,
  };
};

/**
 * 댓글 수정 응답 DTO
 * @param {Object} comment - 수정된 댓글 데이터
 * @returns {Object} 응답 데이터
 */
export const commentUpdateResponseDto = (comment) => {
  return {
    id: comment.id,
    content: comment.content,
    modifiedAt: comment.modifiedAt,
  };
};

/**
 * 댓글 삭제 응답 DTO
 * @returns {Object} 응답 데이터
 */
export const commentDeleteResponseDto = () => {
  return {
    message: "댓글이 성공적으로 삭제되었습니다.",
  };
};

/**
 * 좋아요 응답 DTO
 * @returns {Object} 응답 데이터
 */
export const likeResponseDto = () => {
  return {
    message: "좋아요가 추가되었습니다.",
  };
};

export const unlikeResponseDto = () => {
  return {
    message: "좋아요가 취소되었습니다.",
  };
};

/**
 * 에러 응답 DTO
 * @param {string} errorCode - 에러 코드
 * @param {string} reason - 에러 이유
 * @param {Object} data - 추가 데이터
 * @returns {Object} 에러 응답 데이터
 */
export const commentErrorResponseDto = (errorCode, reason, data = null) => {
  return {
    errorCode,
    reason,
    data,
  };
};
