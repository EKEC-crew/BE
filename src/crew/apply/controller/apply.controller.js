import applyService from '../service/apply.service.js';
import { ApplyRequestDTO, UpdateApplyStatusDto } from '../dto/request/apply.request.dto.js';
import {
  ApplySuccessResponseDTO,
  ApplyErrorResponseDTO,
  createCrewApplicationDetailResponse,
  createCrewApplicationFormResponse,
} from '../dto/response/apply.response.dto.js';

// 크루 지원하기
const applyToCrew = async (req, res, next) => {
  /*
  #swagger.summary = "크루 지원하기"
  #swagger.tags = ["Crew Apply"]
  #swagger.parameters['crewId'] = {
      in: 'path',
      description: '지원할 크루 ID',
      required: true,
      schema: { type: 'integer' }
  }
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      activityList: {
                          type: "array",
                          items: { type: "integer" },
                          description: "선택 활동 ID 배열 (미선택 시 빈 배열 [])"
                      },
                      styleList: {
                          type: "array",
                          items: { type: "integer" },
                          description: "선택 성향/스타일 ID 배열 (미선택 시 빈 배열 [])"
                      },
                      region: {
                          type: "integer",
                          description: "0=미선택, 1=선택(제한 있음)"
                      },
                      age: {
                          type: "integer",
                          description: "0=미선택, 1=선택(제한 있음)"
                      },
                      gender: {
                          type: "integer",
                          description: "0=미선택(제한 없음), 1=선택(제한 있음)"
                      },
                      categoryId: {
                          type: "integer",
                          description: "카테고리 ID (미선택 시 0 또는 필드 생략 가능)",
                          default: 0
                      },
                      answers: {
                          type: "array",
                          description: "Step2 답변 목록",
                          items: {
                              type: "object",
                              properties: {
                                  recruitFormId: { type: "integer", example: 1 },
                                  checkedChoices: {
                                      type: "array",
                                      items: { type: "string" },
                                      example: ["러닝"],
                                      nullable: true
                                  },
                                  answer: {
                                      type: "string",
                                      example: "함께 산에 오르고 싶어요!",
                                      nullable: true
                                  }
                              }
                          }
                      }
                  },
                  required: ["activityList", "styleList", "region", "age", "gender", "answers"]
              },
              examples: {
                  "✅ 문화 크루 지원 - 전체 선택": {
                      summary: "문화 크루 지원 (step1 조건 모두 충족)",
                      value: {
                          activityList: [3, 5],
                          styleList: [2, 3],
                          region: 1,
                          age: 1,
                          gender: 1,
                          categoryId: 2,
                          answers: [
                              { 
                                  recruitFormId: 72, 
                                  checkedChoices: ["전시", "영화", "기타"] 
                              },
                              { 
                                  recruitFormId: 73, 
                                  answer: "안녕하세요! 문화생활을 좋아하는 직장인입니다. 혼자 전시나 영화를 보는 것도 좋지만, 같은 취향을 가진 사람들과 함께 문화생활을 즐기고 싶어서 지원하게 되었습니다. 다양한 문화 콘텐츠에 대해 이야기 나누며 새로운 관점을 얻고 싶습니다." 
                              },
                              { 
                                  recruitFormId: 74, 
                                  checkedChoices: ["주말", "저녁"] 
                              },
                              { 
                                  recruitFormId: 75, 
                                  answer: "주로 주말이나 평일 저녁 시간대에 활동 가능하며, 새로운 장르의 문화생활도 도전해보고 싶습니다!" 
                              }
                          ]
                      }
                  }
              }
          }
      }
  }
  #swagger.responses[201] = {
      description: "지원 성공",
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      resultType: { type: "string", example: "SUCCESS" },
                      error: { type: "null" },
                      success: {
                          type: "object",
                          properties: {
                              message: { type: "string", description: "성공 메시지" }
                          }
                      }
                  }
              },
              example: {
                  resultType: "SUCCESS",
                  error: null,
                  success: {
                      message: "크루 지원이 완료되었습니다."
                  }
              }
          }
      }
  }
  #swagger.responses[400] = {
      description: "잘못된 요청",
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      resultType: { type: "string", example: "FAIL" },
                      error: {
                          type: "object",
                          properties: {
                              message: { type: "string", description: "에러 메시지" },
                              code: { type: "integer", description: "에러 코드" }
                          }
                      },
                      success: { type: "null" }
                  }
              },
              examples: {
                  "중복 지원": {
                      summary: "이미 지원한 크루",
                      value: {
                          resultType: "FAIL",
                          error: {
                              message: "이미 지원한 크루입니다.",
                              code: 400
                          },
                          success: null
                      }
                  },
                  "유효하지 않은 데이터": {
                      summary: "필수 필드 누락",
                      value: {
                          resultType: "FAIL",
                          error: {
                              message: "필수 답변이 누락되었습니다.",
                              code: 400
                          },
                          success: null
                      }
                  }
              }
          }
      }
  }
  #swagger.responses[404] = {
      description: "크루를 찾을 수 없음",
      content: {
          "application/json": {
              example: {
                  resultType: "FAIL",
                  error: {
                      message: "존재하지 않는 크루입니다.",
                      code: 404
                  },
                  success: null
              }
          }
      }
  }
  #swagger.responses[500] = {
      description: "서버 에러",
      content: {
          "application/json": {
              example: {
                  resultType: "FAIL",
                  error: {
                      message: "서버 내부 오류가 발생했습니다.",
                      code: 500
                  },
                  success: null
              }
          }
      }
  }
*/
  try {
    const crewId = parseInt(req.params.crewId);
    const userId = req.payload.id; // JWT 토큰에서 추출한 사용자 ID

    const { userId: bodyUserId, ...requestBody } = req.body;

    const dto = new ApplyRequestDTO({
      ...requestBody,
      crewId,
      userId // JWT에서 추출한 userId 사용
    });

    // 서비스 로직 실행
    await applyService.applyToCrew(dto);

    // 성공 응답
    return res
      .status(201)
      .json(new ApplySuccessResponseDTO('크루 지원이 완료되었습니다.'));
  } catch (err) {
    // 실패 응답
    const statusCode = err.status || 500;
    return res
      .status(statusCode)
      .json(new ApplyErrorResponseDTO(err.message, statusCode));
  }
};

// 특정 크루 특정 지원서 확인하기
export const getCrewApplicationById = async (req, res, next) => {
  /*
#swagger.summary = "특정 지원서 조회 (Step1 + Step2)"
#swagger.tags = ["Crew Apply"]
#swagger.parameters['crewId'] = {
  in: 'path',
  required: true,
  type: 'integer',
  description: '크루 ID'
}
#swagger.parameters['applyId'] = {
  in: 'path',
  required: true,
  type: 'integer',
  description: '지원서 ID'
}
#swagger.responses[200] = {
  description: "지원서 조회 성공",
  content: {
    "application/json": {
      example: {
        resultType: "SUCCESS",
        error: null,
        success: {
          id: 1,
          region: 1,
          age: 2,
          gender: 0,
          crewId: 1,
          userId: 2,
          categoryId: 1,
          activityList: [1, 2],
          styleList: [1, 3],
          user: {
            id: 2,
            name: "지민",
            email: "user2@example.com"
          },
          category: {
            id: 1,
            content: "운동"
          },
          answers: [
            {
              recruitFormId: 1,
              checkedChoices: ["러닝"]
            },
            {
              recruitFormId: 2,
              checkedChoices: ["지인 추천", "SNS"]
            },
            {
              recruitFormId: 3,
              answer: "함께 산에 오르고 싶어요!"
            }
          ]
        }
      }
    }
  }
}
*/
  try {
    const { crewId, applyId } = req.params;

    const result = await applyService.getCrewApplicationById(+crewId, +applyId);

    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: createCrewApplicationDetailResponse(result),
    });
  } catch (error) {
    next(error);
  }
};

// 특정 크루 특정 지원서 승인/거절 하기
export const updateApplicationStatus = async (req, res, next) => {
  /*
    #swagger.summary = "크루 지원 상태 변경 (승인/거절)"
    #swagger.tags = ["Crew Apply"]
    #swagger.parameters['crewId'] = {
        in: 'path',
        description: '크루 ID',
        required: true,
        schema: { type: 'integer' }
    }
    #swagger.parameters['applyId'] = {
        in: 'path',
        description: '지원서 ID',
        required: true,
        schema: { type: 'integer' }
    }
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: { type: "integer", example: 1, description: "1: 승인, 2: 거절" }
                    }
                }
            }
        }
    }
    #swagger.responses[200] = {
        description: "지원 상태 변경 성공",
        content: {
            "application/json": {
                example: {
                    resultType: "SUCCESS",
                    error: null,
                    success: {
                        message: "지원 상태가 승인으로 변경되었습니다.",
                        updated: { count: 1 }
                    }
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: "잘못된 요청",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: {
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "unknown" },
                                reason: { type: "string", description: "에러 메시지" },
                                data: { type: "null" }
                            }
                        },
                        data: { type: "null" }
                    }
                },
                examples: {
                    "정원 초과": {
                        summary: "크루 정원이 가득 찬 경우",
                        value: {
                            resultType: "FAIL",
                            error: {
                                errorCode: "unknown",
                                reason: "크루 정원이 가득 찼습니다. 대기상태로 유지됩니다.",
                                data: null
                            },
                            data: null
                        }
                    },
                    "이미 승인됨": {
                        summary: "이미 승인된 지원서",
                        value: {
                            resultType: "FAIL",
                            error: {
                                errorCode: "unknown",
                                reason: "이미 승인된 지원서입니다.",
                                data: null
                            },
                            data: null
                        }
                    },
                    "이미 크루 멤버": {
                        summary: "이미 크루 멤버인 경우",
                        value: {
                            resultType: "FAIL",
                            error: {
                                errorCode: "unknown",
                                reason: "이미 크루 멤버입니다.",
                                data: null
                            },
                            data: null
                        }
                    },
                    "잘못된 status 값": {
                        summary: "status 값이 숫자가 아닌 경우",
                        value: {
                            resultType: "FAIL",
                            error: {
                                errorCode: "unknown",
                                reason: "status 값이 숫자가 아닙니다.",
                                data: null
                            },
                            data: null
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: "지원서를 찾을 수 없음",
        content: {
            "application/json": {
                example: {
                    resultType: "FAIL",
                    error: {
                        errorCode: "unknown",
                        reason: "지원서를 찾을 수 없습니다.",
                        data: null
                    },
                    data: null
                }
            }
        }
    }
*/
  try {
    const crewId = parseInt(req.params.crewId);
    const applyId = parseInt(req.params.applyId);
    const { status } = req.body;

    if (typeof status !== 'number') {
      throw new Error('status 값이 숫자가 아닙니다.');
    }

    await applyService.updateStatus(crewId, applyId, status);

    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: { message: '지원 상태가 업데이트되었습니다.' },
    });
  } catch (error) {
    next(error);
  }
};

// 특정 크루 지원서 조회하기
export const getCrewApplicationForm = async (req, res, next) => {
  /*
  #swagger.summary = "크루 모집 응답 폼 조회"
  #swagger.tags = ["Crew Apply"]
  #swagger.parameters['crewId'] = {
      in: 'path',
      description: '크루 ID',
      required: true,
      schema: { type: 'integer' }
  }
  #swagger.responses[200] = {
      description: "모집 응답 폼 조회 성공",
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      resultType: { type: "string", example: "SUCCESS" },
                      error: { type: "null" },
                      success: {
                          type: "object",
                          properties: {
                              step1: {
                                  type: "object",
                                  properties: {
                                      gender: { type: "integer", description: "성별 제한 (0: 제한없음, 1: 제한있음)" },
                                      styles: { 
                                          type: "array", 
                                          items: { type: "integer" }, 
                                          description: "스타일/성향 ID 배열" 
                                      },
                                      activities: { 
                                          type: "array", 
                                          items: { type: "integer" }, 
                                          description: "활동 ID 배열" 
                                      },
                                      region: { type: "integer", description: "지역 제한" },
                                      category: { type: "integer", description: "카테고리 ID" },
                                      age: { type: "integer", description: "연령 제한" }
                                  }
                              },
                              step2: {
                                  type: "array",
                                  items: {
                                      type: "object",
                                      properties: {
                                          id: { type: "integer", description: "질문 ID" },
                                          question: { type: "string", description: "질문 내용" },
                                          questionType: { 
                                              type: "integer", 
                                              description: "질문 타입 (0: 객관식, 1: 주관식)" 
                                          },
                                          choiceList: { 
                                              type: "array", 
                                              items: { type: "string" },
                                              nullable: true,
                                              description: "객관식 선택지 (주관식의 경우 null)" 
                                          },
                                          isEtc: { 
                                              type: "integer", 
                                              description: "기타 옵션 여부 (0: 없음, 1: 있음)" 
                                          },
                                          required: { 
                                              type: "integer", 
                                              description: "필수 응답 여부 (0: 선택, 1: 필수)" 
                                          }
                                      }
                                  }
                              },
                              recruitMessage: { type: "string", description: "모집 메시지" }
                          }
                      }
                  }
              },
              examples: {
                  "실제 응답 예시": {
                      summary: "문화 크루 모집 폼 조회",
                      value: {
                          resultType: "SUCCESS",
                          error: null,
                          success: {
                              step1: {
                                  gender: 1,
                                  styles: [2, 3],
                                  activities: [3, 5],
                                  region: 3,
                                  category: 2,
                                  age: 2
                              },
                              step2: [
                                  {
                                      id: 72,
                                      question: "가장 좋아하는 문화 활동은 무엇인가요?",
                                      questionType: 0,
                                      choiceList: ["전시", "연극", "영화"],
                                      isEtc: 1,
                                      required: 1
                                  },
                                  {
                                      id: 73,
                                      question: "자기소개와 크루 지원 동기를 작성해주세요",
                                      questionType: 1,
                                      choiceList: null,
                                      isEtc: 0,
                                      required: 1
                                  },
                                  {
                                      id: 74,
                                      question: "선호하는 활동 시간대는?",
                                      questionType: 0,
                                      choiceList: ["오전", "오후", "저녁", "주말"],
                                      isEtc: 0,
                                      required: 0
                                  },
                                  {
                                      id: 75,
                                      question: "추가로 하고 싶은 말이 있다면 작성해주세요",
                                      questionType: 1,
                                      choiceList: null,
                                      isEtc: 0,
                                      required: 0
                                  }
                              ],
                              recruitMessage: "문화생활을 함께 즐길 크루원을 모집합니다!"
                          }
                      }
                  }
              }
          }
      }
  }
  #swagger.responses[404] = {
      description: "모집 응답 폼 없음",
      content: {
          "application/json": {
              example: {
                  resultType: "FAIL",
                  error: {
                      message: "해당 크루의 모집 응답 폼이 없습니다.",
                      code: 404
                  },
                  success: null
              }
          }
      }
  }
*/
  try {
    const { crewId } = req.params;
    const result = await applyService.getRecruitFormByCrewId(+crewId);

    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: createCrewApplicationFormResponse(result),
    });
  } catch (error) {
    next(error);
  }
};

export default {
  applyToCrew,
  getCrewApplicationById,
  updateApplicationStatus,
  getCrewApplicationForm,
};