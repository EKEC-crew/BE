/**
 * 공지사항 응답 DTO
 */

/**
 * 공지사항 목록 응답 DTO
 * @param {Array} notices - 공지사항 배열
 * @param {string} crewId - 크루 ID
 * @returns {Object} 응답 데이터
 */
export const noticeListResponseDto = (notices, crewId) => {
  return {
    message: `Crew ${crewId}의 공지사항 목록입니다.`,
    data: notices.map((notice) => ({
      id: notice.id,
      title: notice.title,
      createdAt: notice.createdAt,
      author: notice.crewMember?.user?.nickname || "알 수 없음",
    })),
  };
};

/**
 * 공지사항 상세 응답 DTO
 * @param {Object} notice - 공지사항 데이터
 * @returns {Object} 응답 데이터
 */
export const noticeDetailResponseDto = (notice) => {
  return {
    id: notice.id,
    title: notice.title,
    content: notice.content,
    createdAt: notice.createdAt,
    modifiedAt: notice.modifiedAt,
    author: {
      nickname: notice.crewMember?.user?.nickname || "알 수 없음",
      image: notice.crewMember?.user?.image || null,
    },
  };
};

/**
 * 공지사항 생성 응답 DTO
 * @param {Object} notice - 생성된 공지사항 데이터
 * @returns {Object} 응답 데이터
 */
export const noticeCreateResponseDto = (notice) => {
  return {
    id: notice.id,
    title: notice.title,
    content: notice.content,
    createdAt: notice.createdAt,
    crewId: notice.crewId,
    crewMemberId: notice.crewMemberId,
  };
};

/**
 * 공지사항 수정 응답 DTO
 * @param {Object} notice - 수정된 공지사항 데이터
 * @returns {Object} 응답 데이터
 */
export const noticeUpdateResponseDto = (notice) => {
  return {
    id: notice.id,
    title: notice.title,
    content: notice.content,
    modifiedAt: notice.modifiedAt,
  };
};

/**
 * 공지사항 삭제 응답 DTO
 * @returns {Object} 응답 데이터
 */
export const noticeDeleteResponseDto = () => {
  return {
    message: "공지가 성공적으로 삭제되었습니다.",
  };
};

/**
 * 에러 응답 DTO
 * @param {string} errorCode - 에러 코드
 * @param {string} reason - 에러 이유
 * @param {Object} data - 추가 데이터
 * @returns {Object} 에러 응답 데이터
 */
export const noticeErrorResponseDto = (errorCode, reason, data = null) => {
  return {
    errorCode,
    reason,
    data,
  };
};
