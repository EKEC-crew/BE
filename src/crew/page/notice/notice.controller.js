//notice.service.js에서 로직 가져옴
import * as noticeService from "./notice.service.js";

/*
 * 1. 공지 리스트 조회
 */
export const getNotices = async (req, res, next) => {
  try {
    const { crewId } = req.params;
    const result = await noticeService.getNotices(crewId);

    //res.success(result); //성공 응답

    res.success({
      message: `Crew ${crewId}의 공지사항 목록입니다.`,
      data: result,
    });
  } catch (err) {
    next(err); // 에러 발생 시 전역 에러 핸들러로 전달
  }
};

/*
 * 2. 공지 작성
 */
// #swagger.tags = ['Notice']
// #swagger.description = '공지 생성 API'
// #swagger.requestBody = {
//   required: true,
//   content: {
//     "application/json": {
//       schema: {
//         type: "object",
//         properties: {
//           title: { type: "string", example: "공지 제목" },
//           content: { type: "string", example: "공지 내용" }
//         },
//         required: ["title", "content"]
//       }
//     }
//   }
// }
export const createNotice = async (req, res, next) => {
  try {
    // 1. 요청(request)에서 필요한 정보를 가져옵니다.
    const { crewId } = req.params; // URL 경로에서 crewId 획득
    const noticeData = req.body; // 요청 본문에서 title, content 획득

    // 2. 테스트를 위해 임시로 사용자 ID를 1로 설정
    //const userId = req.user.id;
    const userId = 1;

    const newNotice = await noticeService.createNotice(
      crewId,
      userId,
      noticeData
    );
    res.success(newNotice);
  } catch (err) {
    next(err);
  }
};

/*
 * 3. 특정 크루 공지 상세 조회
 */
export const getNoticeDetails = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const notice = await noticeService.getNoticeDetails(noticeId);
    res.success(notice);
  } catch (err) {
    next(err);
  }
};

/*
 * 4. 특정 크루 공지 수정
 */
export const updateNotice = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const noticeUpdateData = req.body; // { title, content }

    // 인증 미들웨어로부터 사용자 ID 획득
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: "사용자 인증이 필요합니다.",
      });
    }

    const updatedNotice = await noticeService.updateNotice(
      noticeId,
      userId,
      noticeUpdateData
    );
    res.success(updatedNotice);
  } catch (err) {
    next(err);
  }
};

/*
 * 5. 특정 크루 공지 삭제
 */
export const deleteNotice = async (req, res, next) => {
  try {
    const { noticeId } = req.params;

    // 인증 미들웨어로부터 사용자 ID 획득
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: "사용자 인증이 필요합니다.",
      });
    }

    const result = await noticeService.deleteNotice(noticeId, userId);
    res.success(result);
  } catch (err) {
    next(err);
  }
};
