import applyService from '../service/apply.service.js';
import { ApplyRequestDTO } from '../dto/request/apply.request.dto.js';
import {
    ApplySuccessResponseDTO,
    ApplyErrorResponseDTO,
} from '../dto/response/apply.response.dto.js';

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
                        userId: { type: "integer", example: 1 },
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
                        categoryId: { type: "integer", example: 3 },
                        answers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    recruitFormId: { type: "integer", example: 10 },
                                    checkedChoices: {
                                        type: "array",
                                        items: { type: "string" },
                                        example: ["추천", "SNS"]
                                    },
                                    answer: { type: "string", example: "블로그 보고 알게 됐어요" }
                                }
                            }
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

export default {
    applyToCrew,
};
