import { StatusCodes } from "http-status-codes";
import * as roleService from "../service/role.service.js";
import * as roleRequest from "../dto/request/role.request.dto.js";

export const getMemberRole = async (req, res, next) => {
    console.log("특정 크루 역할 조회를 요청했습니다.");

    const { crewId } = req.params;
    const userId = req.payload.id;

    const response = await roleService.getMemberRole(roleRequest.getMemberRoleRequest(userId, crewId));
    // #region Swagger: 특정 크루 특정 멤버 역할 조회 API
    /*
        #swagger.summary = '특정 크루 특정 멤버 역할 조회 API (로그인 필요)';
        #swagger.tags = ["Crew Role"]
        #swagger.responses[200] = {
        description: "특정 크루 특정 멤버 역할 조회 성공 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "SUCCESS" },
                error: { type: "object", nullable: true, example: null },
                data: {
                    type: "object", example: 
                    {
                        "memberId": 3,
                        "role": 0
                    }
                }
                }
            }
            }
        }
        };
        #swagger.responses[400] = {
        description: "특정 크루 특정 멤버 역할 조회 실패 응답",
        content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { type: "string", example: "FAIL" },
                    error: {
                    type: "object",
                    properties: {
                        errorCode: { type: "string", example: "400" },
                        reason: { type: "string" },
                        data: { type: "object" }
                    }
                },
                success: { type: "object", nullable: true, example: null }
                }
            }
            }
        }
        };
    */
    // #endregion
    res.status(StatusCodes.OK).success(response);
}