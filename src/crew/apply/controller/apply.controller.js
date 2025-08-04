import applyService from '../service/apply.service.js';
import { ApplyRequestDTO, UpdateApplyStatusDto } from '../dto/request/apply.request.dto.js';
import {
  ApplySuccessResponseDTO,
  ApplyErrorResponseDTO,
  createCrewApplicationDetailResponse,
  createCrewRecruitFormResponse,
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
                      userId: { type: "integer", example: 2 },
                      activityList: {
                          type: "array",
                          items: { type: "integer" },
                          example: [1, 2]
                      },
                      styleList: {
                          type: "array",
                          items: { type: "integer" },
                          example: [1, 3]
                      },
                      region: { type: "integer", example: 1 },
                      age: { type: "integer", example: 2 },
                      gender: { type: "integer", example: 0 },
                      categoryId: { type: "integer", example: 1 },
                      answers: {
                          type: "array",
                          items: {
                              type: "object",
                              properties: {
                                  recruitFormId: { type: "integer", example: 1 },
                                  checkedChoices: {
                                      type: "array",
                                      items: { type: "string" },
                                      example: ["러닝"]
                                  },
                                  answer: {
                                      type: "string",
                                      example: "함께 산에 오르고 싶어요!"
                                  }
                              }
                          },
                          example: [
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
  }
  #swagger.responses[201] = {
      description: "지원 성공",
      content: {
          "application/json": {
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
*/
  try {
    const crewId = parseInt(req.params.crewId);

    // 요청 본문 + crewId DTO로 래핑
    const dto = new ApplyRequestDTO({ ...req.body, crewId });

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
              example: {
                  resultType: "SUCCESS",
                  error: null,
                  success: [
                      {
                          id: 1,
                          question: "어떤 활동을 선호하시나요?",
                          questionType: 0,
                          choiceList: ["러닝", "요가"],
                          isEtc: 0,
                          required: 1
                      },
                      {
                          id: 2,
                          question: "이 크루를 어떻게 알게 되었나요?",
                          questionType: 1,
                          choiceList: ["SNS", "지인 추천"],
                          isEtc: 1,
                          required: 1
                      },
                      {
                          id: 3,
                          question: "기타 하고 싶은 말이 있다면 작성해주세요.",
                          questionType: 2,
                          choiceList: null,
                          isEtc: 0,
                          required: 0
                      }
                  ]
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
      success: createCrewRecruitFormResponse(result),
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
