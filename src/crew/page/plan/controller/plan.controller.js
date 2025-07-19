import * as planService from "../service/plan.service.js";

/**
 * #swagger.summary = "크루 일정 생성"
 * #swagger.tags = ["Crew Plan"]
 * #swagger.parameters['crewId'] = {
 *   in: 'path',
 *   required: true,
 *   type: "integer",
 *   description: "크루 ID"
 * }
 * #swagger.requestBody = {
 *   required: true,
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         required: ["crewMemberId", "title", "content", "type"],
 *         properties: {
 *           crewMemberId: { type: "integer", example: 3 },
 *           title: { type: "string", example: "저녁 모임" },
 *           content: { type: "string", example: "7시 강남역" },
 *           day: { type: "string", format: "date-time", example: "2025-07-20T19:00:00.000Z" },
 *           type: { type: "integer", example: 0 },
 *           isRequired: { type: "boolean", example: false },
 *           allowComments: { type: "boolean", example: true },
 *           allowPrivateComments: { type: "boolean", example: true },
 *           allowExternalShare: { type: "boolean", example: false },
 *           hasFee: { type: "boolean", example: true },
 *           fee: { type: "integer", example: 5000 },
 *           feePurpose: { type: "string", example: "회식비" }
 *         }
 *       }
 *     }
 *   }
 * }
 * #swagger.responses[200] = {
 *   description: "일정 생성 성공",
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
 *               createdAt: { type: "string", format: "date-time" }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * #swagger.responses[400] = {
 *   description: "입력값 오류",
 *   content: {
 *     "application/json": {
 *       schema: {
 *         resultType: { type: "string", example: "FAIL" },
 *         error: {
 *           type: "object",
 *           properties: {
 *             errorCode: { type: "string", example: "I001" },
 *             reason: { type: "string", example: "필수 항목 누락" },
 *             data: { type: "object" }
 *           }
 *         },
 *         data: { type: "null", example: null }
 *       }
 *     }
 *   }
 * }
 */
export const createPlan = async (req, res, next) => {
  try {
    const crewId = parseInt(req.params.crewId);
    const response = await planService.CrewPlanService.createPlan(crewId, req.body);
    return res.success(response);
  } catch (err) {
    next(err);
  }
};
