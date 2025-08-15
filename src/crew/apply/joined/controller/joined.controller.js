import joinedService from '../service/joined.service.js';

const getMyJoined = async (req, res, next) => {
  /*
    #swagger.summary = "내가 가입한 크루 목록 조회"
    #swagger.tags = ["Crew Apply"]
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: {
                type: "string",
                example: "SUCCESS"
              },
              error: {
                type: "null",
                example: null
              },
              success: {
                type: "object",
                properties: {
                  totalCount: {
                    type: "integer",
                    example: 1
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        crewId: {
                          type: "integer",
                          example: 16
                        },
                        crewName: {
                          type: "string",
                          example: "테스트 크루"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[401] = {
      description: "인증 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: {
                type: "string",
                example: "FAIL"
              },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    example: "U003"
                  },
                  reason: {
                    type: "string",
                    example: "로그인이 필요합니다."
                  },
                  data: {
                    type: "null",
                    example: null
                  }
                }
              },
              data: {
                type: "null",
                example: null
              }
            }
          }
        }
      }
    }
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
    const result = await joinedService.getMyJoined(userId);

    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: result,
    });
  } catch (err) {
    next(err);
  }
};

export default { getMyJoined };