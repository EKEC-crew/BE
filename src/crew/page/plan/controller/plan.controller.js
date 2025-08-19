import * as planService from "../service/plan.service.js";
import { InvalidInputValueError } from "../../../../error.js";

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
            required: ["title", "content", "type"],
            properties: {
              title: { type: "string", example: "저녁 모임" },
              content: { type: "string", example: "7시 강남역" },
              day: { type: "string", format: "date-time", example: "2025-07-20T19:00:00.000Z" },
              type: { type: "integer", example: 0, description: "0: 정기모임(운영진/크루장만), 1: 번개모임(모든 멤버)" },
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

    // JWT 토큰에서 사용자 ID 추출
    const userId = req.payload.id;
    const response = await planService.CrewPlanService.createPlan(
      crewId,
      req.body,
      userId,
    );
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
   *               commentCount: { type: "integer", example: 5 },
   *               likeCount: { type: "integer", example: 12 },
   *               createdAt: { type: "string", format: "date-time", example: "2024-01-15 14:30:00" },
   *               updatedAt: { type: "string", format: "date-time", example: "2024-01-15 15:30:00", nullable: true }
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
    const userId = req.payload?.id; // JWT 토큰에서 사용자 ID 추출 (선택적)
    const plan = await planService.CrewPlanService.getPlanById(crewId, planId, userId);
    return res.success(plan);
  } catch (err) {
    next(err);
  }
};

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
                      commentCount: { type: "integer", example: 5 },
                      likeCount: { type: "integer", example: 12 },
                      createdAt: { type: "string", format: "date-time", example: "2024-01-15 14:30:00" },
                      updatedAt: { type: "string", format: "date-time", example: "2024-01-15 15:30:00", nullable: true }
                    }
                  }
                },
                pagination: {
                  type: "object",
                  properties: {
                    totalElements: { type: "number", example: 25 },
                    currentPage: { type: "number", example: 1 },
                    pageSize: { type: "number", example: 10 },
                    totalPages: { type: "number", example: 3 },
                    hasNext: { type: "boolean", example: true },
                    hasPrevious: { type: "boolean", example: false }
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
    const userId = req.payload?.id; // JWT 토큰에서 사용자 ID 추출 (선택적)

    const result = await planService.CrewPlanService.getPlanListByCrewId(
      crewId,
      page,
      size,
      userId
    );
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
    const { crewId } = req.params;
    const { planId } = req.params;
    const plan = await planService.CrewPlanService.updatePlanById(
      crewId,
      planId,
      req.body,
    );
    return res.success(plan);
  } catch (err) {
    next(err);
  }
};

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
    const { crewId } = req.params;
    const { planId } = req.params;
    await planService.CrewPlanService.deletePlan(crewId, planId);
    return res.success({ message: "일정이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

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
          required: ["content"],
          properties: {
            content: { type: "string", example: "참석하겠습니다!" },
            isPublic: { type: "boolean", example: true, description: "공개 댓글 여부 (기본값: true)" }
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
    const { crewId, planId } = req.params;

    // JWT 토큰에서 사용자 ID 추출
    const userId = req.payload.id;

    const comment = await planService.CrewPlanCommentService.createComment(
      Number(crewId),
      Number(planId),
      req.body,
      userId,
    );

    return res.success(comment);
  } catch (err) {
    next(err);
  }
};

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
    const { crewId, planId, commentId } = req.params;

    const comment = await planService.CrewPlanCommentService.getCommentById(
      Number(crewId),
      Number(planId),
      Number(commentId)
    );

    return res.success(comment);
  } catch (err) {
    next(err);
  }
};

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
   *                 createdAt: { type: "string", format: "date-time", example: "2024-01-15 14:30:00" },
   *                 updatedAt: { type: "string", format: "date-time", example: "2024-01-15 15:30:00", nullable: true }
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
    const { crewId, planId } = req.params;
    const page = Number(req.query.page || 1);
    const size = Number(req.query.size || 10);

    const commentList = await planService.CrewPlanCommentService.getCommentList(
      {
        crewId: Number(crewId),
        planId: Number(planId),
        page,
        size,
      },
    );

    return res.success(commentList);
  } catch (err) {
    next(err);
  }
};

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
    const { crewId, planId, commentId } = req.params;

    const comment = await planService.CrewPlanCommentService.updateComment(
      Number(crewId),
      Number(planId),
      Number(commentId),
      req.body,
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
    const { crewId, planId, commentId } = req.params;

    const result = await planService.CrewPlanCommentService.deleteComment(
      Number(crewId),
      Number(planId),
      Number(commentId),
    );

    return res.success(result);
  } catch (err) {
    next(err);
  }
};

// 일정 좋아요 추가
export const likePlan = async (req, res, next) => {
  /*
    #swagger.summary = "크루 일정 좋아요 추가"
    #swagger.tags = ["Crew Plan"]
    #swagger.parameters['crewId'] = {
      in: 'path',
      required: true,
      description: '크루 ID',
      schema: { type: 'integer' }
    }
    #swagger.parameters['planId'] = {
      in: 'path',
      required: true,
      description: '일정 ID',
      schema: { type: 'integer' }
    }
    #swagger.responses[200] = {
      description: '좋아요 추가 성공',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", example: "좋아요가 추가되었습니다." },
              planId: { type: "integer", example: 1 },
              likeCount: { type: "integer", example: 5 },
              isLiked: { type: "boolean", example: true }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: '이미 좋아요를 누른 일정'
    }
  */
  try {
    const { crewId, planId } = req.params;
    const userId = req.payload.id;

    const result = await planService.CrewPlanLikeService.likePlan(
      Number(crewId),
      Number(planId),
      Number(userId),
    );

    return res.success(result);
  } catch (err) {
    next(err);
  }
};

// 일정 좋아요 취소
export const unlikePlan = async (req, res, next) => {
  /*
    #swagger.summary = "크루 일정 좋아요 취소"
    #swagger.tags = ["Crew Plan"]
    #swagger.parameters['crewId'] = {
      in: 'path',
      required: true,
      description: '크루 ID',
      schema: { type: 'integer' }
    }
    #swagger.parameters['planId'] = {
      in: 'path',
      required: true,
      description: '일정 ID',
      schema: { type: 'integer' }
    }
    #swagger.responses[200] = {
      description: '좋아요 취소 성공',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", example: "좋아요가 취소되었습니다." },
              planId: { type: "integer", example: 1 },
              likeCount: { type: "integer", example: 4 },
              isLiked: { type: "boolean", example: false }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: '좋아요를 누르지 않은 일정'
    }
  */
  try {
    const { crewId, planId } = req.params;
    const userId = req.payload.id;

    const result = await planService.CrewPlanLikeService.unlikePlan(
      Number(crewId),
      Number(planId),
      Number(userId),
    );

    return res.success(result);
  } catch (err) {
    next(err);
  }
};

// 일정 신청 
export const applyToPlan = async (req, res, next) => {
  /*
    #swagger.summary = "크루 일정 신청"
    #swagger.tags = ["Crew Plan"]
    #swagger.parameters['crewId'] = {
      in: 'path',
      required: true,
      description: '크루 ID',
      schema: { type: 'integer' }
    }
    #swagger.parameters['planId'] = {
      in: 'path',
      required: true,
      description: '일정 ID',
      schema: { type: 'integer' }
    }
    #swagger.responses[200] = {
      description: '일정 신청 성공',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", example: "일정 신청이 완료되었습니다." },
              planId: { type: "integer", example: 1 },
              status: { type: "integer", example: 1 },
              applicant: { type: "string", example: "홍길동" }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: '이미 신청한 일정'
    }
  */
  try {
    const { crewId, planId } = req.params;
    const userId = req.payload.id;

    const result = await planService.CrewPlanRequestService.applyToPlan(
      Number(crewId),
      Number(planId),
      Number(userId),
    );

    return res.success(result);
  } catch (err) {
    next(err);
  }
};

// 다가오는 일정 리스트 조회
export const getUpcomingPlans = async (req, res, next) => {
  /*
    #swagger.summary = "다가오는 일정 리스트 조회"
    #swagger.tags = ["Crew Plan"]
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
      description: "페이지 크기 (기본 5)"
    }
    #swagger.responses[200] = {
      description: "다가오는 일정 목록 조회 성공",
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
                        crew_name: { type: "string", example: "사이클링히트" },
                        title: { type: "string", example: "잠실 두산베어스 VS 삼성라이온즈" },
                        day: { type: "string", format: "date-time", example: "2025-07-17T19:00:00.000Z" },
                        daysUntil: { type: "number", example: 0, description: "0: 오늘, 양수: N일 후" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      totalElements: { type: "number", example: 25 },
                      currentPage: { type: "number", example: 1 },
                      pageSize: { type: "number", example: 5 },
                      totalPages: { type: "number", example: 5 },
                      hasNext: { type: "boolean", example: true },
                      hasPrevious: { type: "boolean", example: false }
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
  */
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    const userId = req.payload?.id; // JWT 토큰에서 사용자 ID 추출 (선택적)

    const result = await planService.CrewPlanService.getUpcomingPlans(
      page,
      size,
      userId
    );
    return res.success(result);
  } catch (err) {
    next(err);
  }
};
