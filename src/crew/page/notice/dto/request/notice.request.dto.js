/**
 * 공지사항 요청 DTO
 */

/**
 * 공지사항 생성 요청 DTO
 * @param {Object} data - 요청 데이터
 * @param {string} data.title - 공지 제목
 * @param {string} data.content - 공지 내용
 * @param {number} data.type - 공지 유형 (0: 일반, 1: 필수)
 * @returns {Object} 검증된 데이터
 */
export const createNoticeRequestDto = (data) => {
  const { title, content, type } = data;

  // 필수 필드 검증
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw new Error("공지 제목은 필수이며 비어있을 수 없습니다.");
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new Error("공지 내용은 필수이며 비어있을 수 없습니다.");
  }

  if (type === undefined || type === null || ![0, 1].includes(Number(type))) {
    throw new Error("공지 유형은 0(일반) 또는 1(필수) 중 하나여야 합니다.");
  }

  // 길이 제한 검증
  if (title.length > 50) {
    throw new Error("공지 제목은 50자를 초과할 수 없습니다.");
  }

  return {
    title: title.trim(),
    content: content.trim(),
    type: Number(type),
  };
};

/**
 * 공지사항 수정 요청 DTO
 * @param {Object} data - 요청 데이터
 * @param {string} data.title - 공지 제목
 * @param {string} data.content - 공지 내용
 * @param {number} data.type - 공지 유형 (0: 일반, 1: 필수)
 * @returns {Object} 검증된 데이터
 */
export const updateNoticeRequestDto = (data) => {
  const { title, content, type } = data;

  // 필수 필드 검증
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw new Error("공지 제목은 필수이며 비어있을 수 없습니다.");
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new Error("공지 내용은 필수이며 비어있을 수 없습니다.");
  }

  if (type === undefined || type === null || ![0, 1].includes(Number(type))) {
    throw new Error("공지 유형은 0(일반) 또는 1(필수) 중 하나여야 합니다.");
  }

  // 길이 제한 검증
  if (title.length > 50) {
    throw new Error("공지 제목은 50자를 초과할 수 없습니다.");
  }

  return {
    title: title.trim(),
    content: content.trim(),
    type: Number(type),
  };
};

/**
 * 공지사항 ID 검증 DTO
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
