import applicantsService from '../service/applicants.service.js';

export const getApplicants = async (req, res, next) => {
  /*
    #swagger.summary = "특정 크루 지원자 목록 조회"
    #swagger.tags = ["Crew Apply"]
    #swagger.parameters['crewId'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '크루 ID'
    }
    #swagger.responses[200] = {
      description: "지원자 목록 조회 성공",
      content: {
        "application/json": {
          example: {
            resultType: "SUCCESS",
            error: null,
            success: {
              applicants: {
                totalCount: 2,
                applicants: [
                  {
                    applyId: 3,
                    nickname: "지민",
                    profileImage: "https://example.com/profile.png",
                    appliedAt: "2025-08-05T14:30:00.000Z",
                    status: 1
                  },
                  {
                    applyId: 7,
                    nickname: "현수",
                    profileImage: "https://example.com/profile2.png",
                    appliedAt: "2025-08-04T17:15:00.000Z",
                    status: 0
                  }
                ]
              }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      description: "크루장이 아닌 사용자가 접근한 경우",
      content: {
        "application/json": {
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "403",
              reason: "해당 크루의 크루장만 지원자 목록을 조회할 수 있습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */
  try {
    // const userId = req.user.id;
    const crewId = parseInt(req.params.crewId);

    const applicants = await applicantsService.getApplicants({ crewId });

    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: {
        applicants,
      },
    });
  } catch (err) {
    next(err);
  }
};