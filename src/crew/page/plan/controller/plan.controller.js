import * as planService from "../service/plan.service.js";

export const createPlan = async (req, res, next) => {
  /*
    #swagger.summary = "크루 일정 생성"
    #swagger.tags = ["Crew Plan"]
    #swagger.parameters['crewId'] = {
      in: 'path',
      required: true,
      type: "integer",
      description: "크루 ID"
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["crewMemberId", "title", "content", "type"],
            properties: {
              crewMemberId: { type: "integer", example: 3 },
              title: { type: "string", example: "저녁 모임" },
              content: { type: "string", example: "7시 강남역" },
              day: { type: "string", format: "date-time", example: "2025-07-20T19:00:00.000Z" },
              type: { type: "integer", example: 0 },
              isRequired: { type: "boolean", example: false },
              allowComments: { type: "boolean", example: true },
              allowPrivateComments: { type: "boolean", example: true },
              allowExternalShare: { type: "boolean", example: false },
              hasFee: { type: "boolean", example: true },
              fee: { type: "integer", example: 5000 },
              feePurpose: { type: "string", example: "회식비" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "일정 생성 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              data: {
                type: "object",
                properties: {
                  id: { type: "number", example: 12 },
                  crew_name: { type: "string", example: "코딩 크루" },
                  writer: { type: "string", example: "비쿠" },
                  title: { type: "string", example: "저녁 모임" },
                  content: { type: "string", example: "7시 강남역" },
                  day: { type: "string", format: "date-time" },
                  type: { type: "number", example: 0 },
                  isRequired: { type: "boolean" },
                  allowComments: { type: "boolean" },
                  allowPrivateComments: { type: "boolean" },
                  allowExternalShare: { type: "boolean" },
                  hasFee: { type: "boolean" },
                  fee: { type: "integer" },
                  feePurpose: { type: "string" },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "입력값 오류"
    }
  */

    try {
      const crewId = parseInt(req.params.crewId);
      if (isNaN(crewId)) {
        console.error("잘못된 crewId:", req.params.crewId);
        throw new InvalidInputValueError("유효하지 않은 crewId입니다.");
      }
  
      const response = await planService.CrewPlanService.createPlan(crewId, req.body);
      return res.success(response);
    } catch (err) {
      next(err);
    }
};

export const getPlanById = async (req, res, next) => {
/**
 * #swagger.summary = "특정 크루 일정 조회"
 * #swagger.tags = ["Crew Plan"]
 * #swagger.parameters['crewId'] = {
 *   in: 'path',
 *   required: true,
 *   type: "integer",
 *   description: "크루 ID"
 * }
 * #swagger.parameters['planId'] = {
 *   in: 'path',
 *   required: true,
 *   type: "integer",
 *   description: "일정 ID"
 * }
 * #swagger.responses[200] = {
 *   description: "일정 조회 성공",
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         properties: {
 *           resultType: { type: "string", example: "SUCCESS" },
 *           error: { type: "object", nullable: true, example: null },
 *           data: {
 *             type: "object",
 *             properties: {
 *               id: { type: "number", example: 12 },
 *               crew_name: { type: "string", example: "코딩 크루" },
 *               writer: { type: "string", example: "비쿠" },
 *               title: { type: "string", example: "저녁 모임" },
 *               content: { type: "string", example: "7시 강남역" },
 *               day: { type: "string", format: "date-time" },
 *               type: { type: "number", example: 0 },
 *               isRequired: { type: "boolean" },
 *               allowComments: { type: "boolean" },
 *               allowPrivateComments: { type: "boolean" },
 *               allowExternalShare: { type: "boolean" },
 *               hasFee: { type: "boolean" },
 *               fee: { type: "integer" },
 *               feePurpose: { type: "string" },
 *               createdAt: { type: "string", format: "date-time" },
 *               updatedAt: { type: "string", format: "date-time" }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * #swagger.responses[404] = {
 *   description: "일정이 존재하지 않음",
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         properties: {
 *           resultType: { type: "string", example: "FAIL" },
 *           error: {
 *             type: "object",
 *             properties: {
 *               errorCode: { type: "string", example: "P001" },
 *               reason: { type: "string", example: "해당하는 일정이 존재하지 않습니다." },
 *               data: {
 *                 type: "object",
 *                 properties: {
 *                   crewId: { type: "integer", example: 1 },
 *                   planId: { type: "integer", example: 5 }
 *                 }
 *               }
 *             }
 *           },
 *           data: { type: "null", example: null }
 *         }
 *       }
 *     }
 *   }
 * }
 */

  try {
    const crewId = parseInt(req.params.crewId);
    const planId = parseInt(req.params.planId);
    const plan = await planService.CrewPlanService.getPlanById(crewId, planId);
    return res.success(plan);
  } catch (err) {
    next(err);
  }
}

export const getPlanList = async (req, res, next) => {
  /*
  #swagger.summary = "특정 크루 일정 전체 조회"
  #swagger.tags = ["Crew Plan"]
  #swagger.parameters['crewId'] = {
    in: 'path',
    required: true,
    type: "integer",
    description: "크루 ID"
  }
  #swagger.parameters['page'] = {
    in: 'query',
    required: false,
    type: "integer",
    description: "페이지 번호 (기본 1)"
  }
  #swagger.parameters['size'] = {
    in: 'query',
    required: false,
    type: "integer",
    description: "페이지 크기 (기본 10)"
  }
  #swagger.responses[200] = {
    description: "일정 목록 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            data: {
              type: "object",
              properties: {
                plans: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number", example: 12 },
                      crew_name: { type: "string", example: "코딩 크루" },
                      writer: { type: "string", example: "비쿠" },
                      title: { type: "string", example: "저녁 모임" },
                      content: { type: "string", example: "7시 강남역" },
                      day: { type: "string", format: "date-time" },
                      type: { type: "number", example: 0 },
                      isRequired: { type: "boolean" },
                      allowComments: { type: "boolean" },
                      allowPrivateComments: { type: "boolean" },
                      allowExternalShare: { type: "boolean" },
                      hasFee: { type: "boolean" },
                      fee: { type: "integer" },
                      feePurpose: { type: "string" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" }
                    }
                  }
                },
                pagination: {
                  type: "object",
                  properties: {
                    totalCount: { type: "number", example: 25 },
                    currentPage: { type: "number", example: 1 },
                    pageSize: { type: "number", example: 10 },
                    totalPages: { type: "number", example: 3 }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  #swagger.responses[400] = {
    description: "입력값 오류"
  }
  #swagger.responses[404] = {
    description: "크루가 존재하지 않음"
  }
  */
  try {
    const crewId = parseInt(req.params.crewId);
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    
    const result = await planService.CrewPlanService.getPlanListByCrewId(crewId, page, size);
    return res.success(result);
  } catch (err) {
    next(err);
  }
};

export const updatePlan = async (req, res, next) => {
  /*
    #swagger.summary = "특정 크루 일정 수정"
    #swagger.tags = ["Crew Plan"]
    #swagger.parameters['crewId'] = {
      in: 'path',
      required: true,
      type: "integer",
      description: "크루 ID"
    }
    #swagger.parameters['planId'] = {
      in: 'path',
      required: true,
      type: "integer",
      description: "일정 ID"
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string", example: "수정된 제목" },
              content: { type: "string", example: "수정된 내용" },
              day: { type: "string", format: "date-time", example: "2025-08-01T19:00:00.000Z" },
              type: { type: "integer", example: 1 },
              isRequired: { type: "boolean" },
              allowComments: { type: "boolean" },
              allowPrivateComments: { type: "boolean" },
              allowExternalShare: { type: "boolean" },
              hasFee: { type: "boolean" },
              fee: { type: "integer" },
              feePurpose: { type: "string" }
            }
          }
        }
      }
    }
  */
  try {
    const {crewId} = req.params;
    const {planId} = req.params; 
    const plan = await planService.CrewPlanService.updatePlanById(crewId, planId, req.body);
    return res.success(plan);
  } catch (err) {
    next(err);
  }
}

export const deletePlan = async (req, res, next) => {
  /*
  #swagger.summary = "특정 크루 일정 삭제"
  #swagger.tags = ["Crew Plan"]
  #swagger.parameters['crewId'] = {
    in: 'path',
    required: true,
    type: "integer",
    description: "크루 ID"
  }
  #swagger.parameters['planId'] = {
    in: 'path',
    required: true,
    type: "integer",
    description: "일정 ID"
  }
   #swagger.responses[200] = {
    description: "일정 삭제 성공"
  }
  #swagger.responses[404] = {
    description: "삭제할 일정이 없음"
  }
*/
  try {
    const {crewId} = req.params;
    const {planId} = req.params;
    await planService.CrewPlanService.deletePlan(crewId, planId);
    return res.success({message: "일정이 삭제되었습니다."});
  } catch (err) {
    next(err);
  }
}

export const createPlanComment = async (req, res, next) => {
  /*
  #swagger.summary = "크루 일정 댓글 생성"
  #swagger.tags = ["Crew Plan Comment"]
  #swagger.parameters['crewId'] = { in: 'path', required: true, type: 'integer', description: '크루 ID' }
  #swagger.parameters['planId'] = { in: 'path', required: true, type: 'integer', description: '일정 ID' }
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["crewMemberId", "content"],
          properties: {
            crewMemberId: { type: "integer", example: 3 },
            content: { type: "string", example: "참석하겠습니다!" }
          }
        }
      }
    }
  }
  #swagger.responses[200] = { 
    description: "댓글 생성 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            data: {
              type: "object",
              properties: {
                id: { type: "number", example: 1 },
                content: { type: "string", example: "참석하겠습니다!" },
                writer: { type: "string", example: "비쿠" },
                writerImage: { type: "string", example: "https://example.com/image.jpg" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
              }
            }
          }
        }
      }
    }
  }
  #swagger.responses[400] = { 
    description: "입력값 오류"
  }
  */
  try {
    const {crewId, planId} = req.params;

    const comment = await planService.CrewPlanCommentService.createComment(
      Number(crewId), 
      Number(planId), 
      req.body
    );

    return res.success(comment);
  } catch (err) {
    next(err);
  }
}

export const getPlanCommentById = async (req, res, next) => {
  /**
 * #swagger.summary = "크루 일정 댓글 단건 조회"
 * #swagger.tags = ["Crew Plan Comment"]
 * #swagger.parameters['crewId'] = { in: 'path', required: true, type: 'integer' }
 * #swagger.parameters['planId'] = { in: 'path', required: true, type: 'integer' }
 * #swagger.parameters['commentId'] = { in: 'path', required: true, type: 'integer' }
 * #swagger.responses[200] = { 
 *   description: "댓글 단건 조회 성공",
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         properties: {
 *           resultType: { type: "string", example: "SUCCESS" },
 *           error: { type: "object", nullable: true, example: null },
 *           data: {
 *             type: "object",
 *             properties: {
 *               id: { type: "number", example: 1 },
 *               content: { type: "string", example: "참석하겠습니다!" },
 *               writer: { type: "string", example: "비쿠" },
 *               writerImage: { type: "string", example: "https://example.com/image.jpg" },
 *               createdAt: { type: "string", format: "date-time" },
 *               updatedAt: { type: "string", format: "date-time" }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * #swagger.responses[404] = { 
 *   description: "댓글이 존재하지 않음"
 * }
 */

  try {
    const {crewId, planId, commentId} = req.params;

    const comment = await planService.CrewPlanCommentService.getCommentById(
      Number(crewId),
      Number(planId), 
      Number(commentId)
    );

    return res.success(comment);
  } catch (err) {
    next(err);
  }
}

export const getPlanCommentList = async (req, res, next) => {
  /**
 * #swagger.summary = "크루 일정 댓글 목록 조회"
 * #swagger.tags = ["Crew Plan Comment"]
 * #swagger.parameters['crewId'] = { in: 'path', required: true, type: 'integer', description: '크루 ID' }
 * #swagger.parameters['planId'] = { in: 'path', required: true, type: 'integer', description: '일정 ID' }
 * #swagger.parameters['page'] = { in: 'query', required: false, type: 'integer', description: '페이지 번호 (기본 1)' }
 * #swagger.parameters['size'] = { in: 'query', required: false, type: 'integer', description: '페이지 크기 (기본 10)' }
 * #swagger.responses[200] = { 
 *   description: "댓글 목록 조회 성공",
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         properties: {
 *           resultType: { type: "string", example: "SUCCESS" },
 *           error: { type: "object", nullable: true, example: null },
 *           data: {
 *             type: "array",
 *             items: {
 *               type: "object",
 *               properties: {
 *                 id: { type: "number", example: 1 },
 *                 content: { type: "string", example: "참석하겠습니다!" },
 *                 writer: { type: "string", example: "비쿠" },
 *                 writerImage: { type: "string", example: "https://example.com/image.jpg" },
 *                 createdAt: { type: "string", format: "date-time" },
 *                 updatedAt: { type: "string", format: "date-time" }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */

  try {
    const {crewId, planId} = req.params;
    const page = Number(req.query.page || 1);
    const size = Number(req.query.size || 10);

    const commentList = await planService.CrewPlanCommentService.getCommentList({
      crewId: Number(crewId),
      planId: Number(planId),
      page,
      size,
    });

    return res.success(commentList);
  } catch (err) {
    next(err);
  }
}

export const updatePlanComment = async (req, res, next) => {
  /*
  #swagger.summary = "크루 일정 댓글 수정"
  #swagger.tags = ["Crew Plan Comment"]
  #swagger.parameters['crewId'] = { in: 'path', required: true, type: 'integer' }
  #swagger.parameters['planId'] = { in: 'path', required: true, type: 'integer' }
  #swagger.parameters['commentId'] = { in: 'path', required: true, type: 'integer' }
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", example: "내용을 수정했습니다." }
          }
        }
      }
    }
  }
  #swagger.responses[200] = { 
    description: "댓글 수정 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            data: {
              type: "object",
              properties: {
                id: { type: "number", example: 1 },
                content: { type: "string", example: "내용을 수정했습니다." },
                writer: { type: "string", example: "비쿠" },
                writerImage: { type: "string", example: "https://example.com/image.jpg" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
              }
            }
          }
        }
      }
    }
  }
  #swagger.responses[400] = { 
    description: "수정할 댓글이 존재하지 않거나 입력값 오류"
  }
  */
  try {
    const {crewId, planId, commentId} = req.params;
    
    const comment = await planService.CrewPlanCommentService.updateComment(
      Number(crewId),
      Number(planId),
      Number(commentId),
      req.body
    );
    return res.success(comment);
  } catch (err) {
    next(err);
  }
};

export const deletePlanComment = async (req, res, next) => {
  /**
 * #swagger.summary = "크루 일정 댓글 삭제"
 * #swagger.tags = ["Crew Plan Comment"]
 * #swagger.parameters['crewId'] = { in: 'path', required: true, type: 'integer' }
 * #swagger.parameters['planId'] = { in: 'path', required: true, type: 'integer' }
 * #swagger.parameters['commentId'] = { in: 'path', required: true, type: 'integer' }
 * #swagger.responses[200] = { 
 *   description: "댓글 삭제 성공",
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         properties: {
 *           resultType: { type: "string", example: "SUCCESS" },
 *           error: { type: "object", nullable: true, example: null },
 *           data: {
 *             type: "object",
 *             properties: {
 *               message: { type: "string", example: "댓글이 삭제되었습니다." }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * #swagger.responses[404] = { 
 *   description: "삭제할 댓글이 존재하지 않음"
 * }
 */

  try {
    const {crewId, planId, commentId} = req.params;
    
    const result = await planService.CrewPlanCommentService.deleteComment(
      Number(crewId),
      Number(planId),
      Number(commentId)
    );
    
    return res.success(result);
  } catch (err) {
    next(err);
  }
};
 