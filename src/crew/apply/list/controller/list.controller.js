import listService from '../service/list.service.js';

const getMyPendingApplies = async (req, res, next) => {
  /*
    #swagger.summary = "내가 지원한 크루 목록 조회 (대기중만)"
    #swagger.tags = ["Crew Apply"]
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = { description: "목록 조회 성공" }
  */
  try {
    // auth 미들웨어에서 주입된 사용자 정보 확인
    if (!req.payload || !req.payload.id) {
      return res.status(401).json({
        resultType: 'FAIL',
        error: {
          errorCode: 'UNAUTHORIZED',
          reason: '인증되지 않은 사용자입니다.',
          data: null
        },
        data: null
      });
    }

    const userId = req.payload.id; // auth 미들웨어에서 주입
    const result = await listService.getMyPendingApplies(userId);

    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: result,
    });
  } catch (err) {
    next(err);
  }
};

export default { getMyPendingApplies };