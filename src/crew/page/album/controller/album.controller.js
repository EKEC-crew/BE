import { StatusCodes } from "http-status-codes";
import * as baseError from "../../../../error.js";
import * as albumService from "../service/album.service.js";
import * as albumRequest from "../dto/request/album.request.dto.js";

export const readAlbumImages = async (req, res, next) => {
  const { crewId } = req.params;

  const response = await albumService.readAlbumImages(
    albumRequest.readAlbumImagesRequest(crewId),
  );
  // #region Swagger: 앨범 리스트 조회 API
  /*
        #swagger.summary = '앨범 리스트 조회 API';
        #swagger.tags = ["Crew Album"]
        #swagger.responses[200] = {
        description: "앨범 리스트 조회 성공 응답",
        content: {
            "application/json": {
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "SUCCESS" },
                error: { type: "object", nullable: true, example: null },
                data: {
                    type: "array", items:
                   {
                    type:"object",
                    properties:{
                        albumId: { type: "number", example: 1 },
                        imageName: { type: "string", example: "c4ea80a6-e9e2-478e-92ff-0ca31579bb21.png" }
                    }
                   }
                }
            }
            }
        }
        }
        };
        #swagger.responses[400] = {
            description: "앨범 리스트 조회 실패 응답",
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

export const createAlbumImage = async (req, res, next) => {
  const { crewId } = req.params;
  const userId = req.payload.id;
  const validImageExtensions = ["jpg", "jpeg", "png", "gif"];
  const ext = req.file.originalname.split(".").pop().toLowerCase();
  if (!validImageExtensions.includes(ext)) {
    throw new baseError.InvalidInputValueError(
      "올바른 이미지를 등록 해 주세요.",
      req.body,
    );
  }

  const response = await albumService.createAlbumImage(
    albumRequest.createAlbumImageRequest(userId, crewId, req.file),
  );
  // #region Swagger: 앨범 작성 API
  /*
    #swagger.summary = '앨범 작성 API';
    #swagger.tags = ["Crew Album"]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        image: {
                            type: "string",
                            format: "binary",
                        }
                    },
                    required: ["image"]
                }
            }
            }
        }
        #swagger.responses[200] = {
        description: "게시글 작성 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        data: {
                        type: "string", example: {
                            "albumId": 35,
                            "imageName": "c4ea80a6-e9e2-478e-92ff-0ca31579bb21.png"
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
};
