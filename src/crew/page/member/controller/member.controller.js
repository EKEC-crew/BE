import { StatusCodes } from "http-status-codes";
import * as memberRequest from "../dto/request/member.request.dto.js";
import * as memberService from "../service/member.service.js";

export const readMembersByCrew = async (req, res, next) => {
  console.log("특정 크루 크루원 리스트 조회를 요청했습니다.");

  const { crewId } = req.params;
  const page = req.query.page || 1;
  const size = req.query.size || 24;

  const response = await memberService.readMembersByCrew(memberRequest.readMemberListRequest(crewId, page, size));
  // #region Swagger: 특정 크루 크루원 리스트 조회 API
  /*
    #swagger.summary = '특정 크루 크루원 리스트 조회 API';
    #swagger.tags = ["Crew Member"]
    #swagger.parameters['page'] = { in: 'query', required: false, type: 'integer', description: '페이지 번호 (기본1)' }
    #swagger.parameters['size'] = { in: 'query', required: false, type: 'integer', description: '페이지 크기 (기본24)' }
    #swagger.responses[200] = {
      description: "크루원 리스트 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              data: {
                type: "string", example:  
                [
                  {
                    "crewMemberId": 1,
                    "nickname": "크루장닉",
                    "role": 2
                  },
                  {
                    "crewMemberId": 2,
                    "nickname": "운영진닉",
                    "role": 1
                  },
                  {
                    "crewMemberId": 3,
                    "nickname": "그냥유저닉",
                    "role": 0
                  }
                ]
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "크루원 리스트 조회 실패 응답",
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
};


export const changeRoleCrewMember = async (req, res, next) => {
  console.log("특정 크루 특정 크루원 역할 변경을 요청했습니다.");

  const { crewId, memberId } = req.params;

  console.log("params: ", req.params);

  const response = await memberService.changeRoleCrewMember(
    memberRequest.changeRoleMemberRequest(crewId, memberId)
  );
  // #region Swagger: 특정 크루 특정 크루원 역할 변경 API
  /*
    #swagger.summary = '특정 크루 특정 크루원 역할 변경 API';
    #swagger.tags = ["Crew Member"]
    #swagger.responses[200] = {
      description: "특정 크루 특정 크루원 역할 변경 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "string", example: 
                {
                  "crewMemberId": 1,
                  "nickname": "유저닉",
                  "role": 1
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "특정 크루 특정 크루원 역할 변경 실패 응답",
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
};

export const kickCrewMember = async (req, res, next) => {
  console.log("특정 크루 특정 크루원 방출을 요청했습니다.");

  const { crewId, memberId } = req.params;

  console.log("params: ", req.params);

  const response = await memberService.kickCrewMember(
    memberRequest.kickCrewMemberRequest(crewId, memberId)
  );
  // #region Swagger: 특정 크루 특정 크루원 방출 API
  /*
    #swagger.summary = '특정 크루 특정 크루원 방출 API';
    #swagger.tags = ["Crew Member"]
    #swagger.responses[200] = {
      description: "특정 크루 특정 크루원 방출 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "string", example: 
                {
                  "crewMemberId": 1,
                  "nickname": "유저닉",
                  "role": 0
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "특정 크루 특정 크루원 방출 실패 응답",
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
};
