import { StatusCodes } from "http-status-codes";
import * as memberRequest from "../dto/request/member.request.dto.js";
import * as memberService from "../service/member.service.js";

export const readMembersByCrew = async (req, res, next) => {
  console.log("특정 크루 크루원 리스트 조회를 요청했습니다.");

  const { crewId } = req.params;
  const userId = req.payload.id;
  const page = req.query.page || 1;
  const size = req.query.size || 24;

  const response = await memberService.readMembersByCrew(memberRequest.readMemberListRequest(userId, crewId, page, size));
  // #region Swagger: 특정 크루 크루원 리스트 조회 API
  /*
    #swagger.summary = '특정 크루 크루원 리스트 조회 API(로그인 필요/크루원부터 가능)';
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
                type: "object", example:  
                {
                  "members": [
                    {
                      "memberId": 5,
                      "nickname": "길동이",
                      "role": 2
                    },
                    {
                      "memberId": 6,
                      "nickname": "길동이",
                      "role": 2
                    },
                    {
                      "memberId": 7,
                      "nickname": "손석구",
                      "role": 1
                    },
                    {
                      "memberId": 8,
                      "nickname": "아이유",
                      "role": 1
                    }
                  ],
                  "totalElements": 4,
                  "totalPages": 1,
                  "hasNext": false,
                  "pageNum": 1,
                  "pageSize": 4
                }
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
  const userId = req.payload.id;

  const response = await memberService.changeRoleCrewMember(
    memberRequest.changeRoleMemberRequest(userId, crewId, memberId)
  );
  // #region Swagger: 특정 크루 특정 크루원 역할 변경 API
  /*
    #swagger.summary = '특정 크루 특정 크루원 역할 변경 API(로그인 필요/크루장부터 가능)';
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
              data: {
                type: "object", example: 
                {
                  "memberId": 1,
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
  const userId = req.payload.id;

  const response = await memberService.kickCrewMember(
    memberRequest.kickCrewMemberRequest(userId, crewId, memberId)
  );
  // #region Swagger: 특정 크루 특정 크루원 방출 API
  /*
    #swagger.summary = '특정 크루 특정 크루원 방출 API(로그인 필요/운영진부터 가능)';
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
              data: {
                type: "object", example: 
                {
                  "success" : true
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

  res.status(StatusCodes.OK).success({ success: true });
};

export const addCrewMember = async (req, res, next) => {
  console.log("특정 크루원 저장을 요청했습니다.");

  const { crewId } = req.params;

  const response = await memberService.addCrewMember(memberRequest.addCrewMemberRequest(crewId, req.body));
  // #region Swagger: (개발용)특정 크루 특정 크루원 저장 API
  /*
    #swagger.summary = '(개발용) 특정 크루 특정 크루원 저장 API';
    #swagger.tags = ["Crew Member"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "number", example: 1 }
            },
            required: ["userId"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "특정 크루 특정 크루원 저장 성공 응답",
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
                  "userId": 1,
                  "crewId": 2,
                  "memberId": 3
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "특정 크루 특정 크루원 저장 실패 응답",
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
