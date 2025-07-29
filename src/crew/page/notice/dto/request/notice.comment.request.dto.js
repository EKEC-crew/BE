/**
 * 공지 댓글 요청 DTO
 */

/**
 * 댓글 생성 요청 DTO
 * @param {Object} data - 요청 데이터
 * @param {string} data.content - 댓글 내용
 * @returns {Object} 검증된 데이터
 */
export const createCommentRequestDto = (data) => {
  const { content } = data;

  // 필수 필드 검증
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new Error("댓글 내용은 필수이며 비어있을 수 없습니다.");
  }

  // 길이 제한 검증
  if (content.length > 500) {
    throw new Error("댓글 내용은 500자를 초과할 수 없습니다.");
  }

  return {
    content: content.trim(),
  };
};

/**
 * 댓글 수정 요청 DTO
 * @param {Object} data - 요청 데이터
 * @param {string} data.content - 댓글 내용
 * @returns {Object} 검증된 데이터
 */
export const updateCommentRequestDto = (data) => {
  const { content } = data;

  // 필수 필드 검증
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new Error("댓글 내용은 필수이며 비어있을 수 없습니다.");
  }

  // 길이 제한 검증
  if (content.length > 500) {
    throw new Error("댓글 내용은 500자를 초과할 수 없습니다.");
  }

  return {
    content: content.trim(),
  };
};

/**
 * 댓글 ID 검증 DTO
 * @param {string|number} commentId - 댓글 ID
 * @returns {number} 검증된 ID
 */
export const validateCommentIdDto = (commentId) => {
  const id = parseInt(commentId, 10);

  if (isNaN(id) || id <= 0) {
    throw new Error("유효하지 않은 댓글 ID입니다.");
  }

  return id;
};

/**
 * 공지 ID 검증 DTO
 * @param {string|number} noticeId - 공지 ID
 * @returns {number} 검증된 ID
 */
export const validateNoticeIdDto = (noticeId) => {
  const id = parseInt(noticeId, 10);

  if (isNaN(id) || id <= 0) {
    throw new Error("유효하지 않은 공지 ID입니다.");
  }

  return id;
};

/**
 * 크루 ID 검증 DTO
 * @param {string|number} crewId - 크루 ID
 * @returns {number} 검증된 ID
 */
export const validateCrewIdDto = (crewId) => {
  const id = parseInt(crewId, 10);

  if (isNaN(id) || id <= 0) {
    throw new Error("유효하지 않은 크루 ID입니다.");
  }

  return id;
};
