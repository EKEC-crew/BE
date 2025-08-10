import { StatusCodes } from "http-status-codes";
import * as infoService from "../service/info.service.js";
import * as infoRequest from "../dto/request/info.request.dto.js";

export const readCrewInfo = async (req, res, next) => {
  const { crewId } = req.params;

  const response = await infoService.readCrewInfo(infoRequest.readCrewInfoRequest(crewId));
  // #region Swagger: 특정 크루 정보 조회 API
  /*
    #swagger.summary = '특정 크루 정보 조회 API';
    #swagger.tags = ["Crew Info"]
    #swagger.responses[200] = {
    description: "특정 크루 정보 조회 성공 응답",
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
                  "crewId": 2,
                  "title": "사이클링히트",
                  "content": "2030 즐겨서 하는 모임(제목 아래 짧은 소개)",
                  "score": 0.0,
                  "memberCount": 12,
                  "crewCapacity": 50,
                  "bannerImage": "bannerimage2.png",
                  "nickname": "일병차은우",
                  "profileImage": "profile.png",
                  "category": "스포츠관람",
                  "introduction": "여러분 환영해요! 잠실구장에서 야구를 함께 즐기고 싶은 분...(긴 부분 크루 소개)"
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "특정 크루 정보 조회 실패 응답",
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

export const updateCrewIntroduce = async (req, res, next) => {
  const { crewId } = req.params;
  const userId = req.payload.id;

  const response = await infoService.updateCrewIntroduce(infoRequest.updateCrewIntroduceRequest(userId, crewId, req.body));
  // #region Swagger: 특정 크루 소개 수정 API
  /*
    #swagger.summary = '특정 크루 소개 수정 API (로그인 필요: 크루장)';
    #swagger.tags = ["Crew Info"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              introduction: { type: "string", example: "안녕하세요 환영합니다! 잠실구장에서 야구를 함께.." }
            },
            required: ["introduction"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "특정 크루 소개 수정 성공 응답",
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
                  "crewId": 3,
                  "introduction": "안녕하세요 환영합니다! 잠실구장에서 야구를 함께.."
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "게시글 리스트 조회 실패 응답",
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