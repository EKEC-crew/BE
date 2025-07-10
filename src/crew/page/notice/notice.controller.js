//notice.service.js에서 로직 가져옴
import * as noticeService from "./notice.service.js";

/*
 * 1. 공지 리스트 조회
 */
export const getNotices = async (req, res, next) => {
  try {
    const { crewId } = req.params;
    //const result = await noticeService.getNotices(crewId);
    //res.success(result); //성공 응답

    res.success({ message: "Crew ${crewId}의 공지사항 목록입니다." });
  } catch (err) {
    next(err); // 에러 발생 시 전역 에러 핸들러로 전달
  }
};

/*
 * 2. 특정 크루 공지 작성
 */
export const createNotice = async (req, res, next) => {
  try {
    const { crewId } = req.params;
    const noticeData = req.body;
    console.log("Creating notice for crew: ${crewId", noticeData);

    // const result = await noticeService.createNotice(crewId, noticeData);
    // res.success(result);
    res.success({ message: "Crew ${crewId}에 새로운 공지가 작성되었습니다." });
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
    const userId = req.user.id;

    if (!userId) {
      return res.fail({ message: "사용자 인증이 필요합니다." }, 401);
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
    const userId = req.user.id;

    if (!userId) {
      return res.fail({ message: "사용자 인증이 필요합니다." }, 401);
    }

    const result = await noticeService.deleteNotice(noticeId, userId);
    res.success(result);
  } catch (err) {
    next(err);
  }
};
