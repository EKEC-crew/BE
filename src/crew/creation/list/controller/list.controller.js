import listService from '../service/list.service.js';

const getMyCrews = async (req, res, next) => {
    /*
      #swagger.summary = "내가 만든 크루 목록 조회 (크루장, 운영진)"
      #swagger.tags = ["Crew Creation"]
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
                      description: "크루 총 개수",
                      example: 4
                    },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          crewId: {
                            type: "integer",
                            description: "크루 ID",
                            example: 16
                          },
                          crewName: {
                            type: "string",
                            description: "크루명",
                            example: "테스트 문화생활 크루"
                          },
                          crewImage: {
                            type: "string",
                            description: "크루 배너 이미지",
                            example: "banner_test.jpg"
                          },
                          crewContent: {
                            type: "string",
                            description: "크루 소개",
                            example: "함께 문화생활을 즐기는 크루"
                          },
                          categoryId: {
                            type: "integer",
                            description: "카테고리 ID",
                            example: 2
                          },
                          categoryName: {
                            type: "string",
                            description: "카테고리명",
                            example: "여행"
                          },
                          role: {
                            type: "integer",
                            description: "사용자 역할 (1: 운영진, 2: 크루장)",
                            example: 2
                          },
                          roleLabel: {
                            type: "string",
                            description: "역할 라벨",
                            example: "크루장"
                          },
                          crewCreatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "크루 생성일",
                            example: "2025-08-13T15:48:17.885Z"
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
                      example: "I003"
                    },
                    reason: {
                      type: "string",
                      example: "유효하지 않은 인증 토큰 입니다."
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
        const result = await listService.getMyCrews(userId);

        return res.status(200).json({
            resultType: 'SUCCESS',
            error: null,
            success: result,
        });
    } catch (err) {
        next(err);
    }
};

export default { getMyCrews };