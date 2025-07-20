import { StatusCodes } from "http-status-codes";
import * as postRequest from "../dto/request/post.request.dto.js";
import * as postService from "../service/post.service.js";

export const readPostsByCrew = async (req, res, next) => {
  console.log("특정 크루 게시글 리스트 조회를 요청했습니다.");

  const { crewId } = req.params;

  const response = await postService.readPostsByCrew(postRequest.readPostListRequest(crewId));
  // #region Swagger: 게시글 리스트 조회 API
  /*
    #swagger.summary = '게시글 리스트 조회 API';
    #swagger.responses[200] = {
      description: "게시글 리스트 조회 성공 응답",
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
                    "postId": 2,
                    "title": "크루 22222",
                    "createdAt": "2025-07-18T01:52:40.886Z",
                    "nickname": "길동이",
                    "commentCount": 0
                  },
                  {
                    "postId": 1,
                    "title": "크루 첫 게시글",
                    "createdAt": "2025-07-18T01:42:20.494Z",
                    "nickname": "길동이",
                    "commentCount": 0
                  }
                ]
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

export const createCrewPost = async (req, res, next) => {
  console.log("특정 크루 게시글 작성을 요청했습니다.");

  const { crewId } = req.params;
  console.log("user : ", req.body.userId, "params: ", req.params);

  const response = await postService.createCrewPost(postRequest.createCrewPostRequest(crewId, req.body));
  // #region Swagger: 게시글 작성 API
  /*
    #swagger.summary = '게시글 작성 API';

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string", example: "게시글 작성 테스트 제목입니다." },
              content: { type: "string", example: "게시글 작성 테스트 내용입니다." },
              userId: { type: "number", example: "1" }
            },
            required: ["title", "content", "userId"]
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
              success: {
                type: "string", example: 
                {
                  "postId": 4,
                  "title": "게시글 작성 테스트 제목입니다.",
                  "content": "게시글 작성 테스트 내용입니다.",
                  "createdAt": "2025-07-18T02:04:54.410Z",
                  "commentCount": 0
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

export const readCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 상세 조회를 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log(req.params);

  const response = await postService.readCrewPost(postRequest.readPostRequest(crewId, postId));
  // #region Swagger: 특정 크루 특정 게시글 상세 조회 API
  /*
    #swagger.summary = '특정 크루 특정 게시글 상세 조회 API';

    #swagger.responses[200] = {
      description: "특정 크루 특정 게시글 상세 조회 성공 응답",
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
                  "postId": 1,
                  "title": "크루 첫 게시글",
                  "content": "이 게시글은...",
                  "createdAt": "2025-07-18T01:42:20.494Z",
                  "nickname": "길동이",
                  "commentCount": 0
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "특정 크루 특정 게시글 상세 조회 실패 응답",
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

export const updateCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 수정을 요청했습니다.");

  const { crewId, postId } = req.params;

  console.log("user : ", req.body.userId, "params: ", req.params);


  const response = await postService.updateCrewPost(postRequest.updateCrewPostRequest(crewId, postId, req.body));
  // #region Swagger: 특정 크루 특정 게시글 수정 API
  /*
    #swagger.summary = '특정 크루 특정 게시글 수정 API';

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string", example: "게시글 수정 테스트 제목입니다." },
              content: { type: "string", example: "게시글 수정 테스트 내용입니다." },
              userId: { type: "number", example: "1" }
            },
            required: ["title", "content", "userId"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "특정 크루 특정 게시글 수정 성공 응답",
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
                  "postId": 4,
                  "title": "게시글 수정 테스트 제목입니다.",
                  "content": "게시글 수정 테스트 내용입니다.",
                  "createdAt": "2025-07-18T02:04:54.410Z",
                  "commentCount": 0
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "특정 크루 특정 게시글 수정 실패 응답",
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

export const deleteCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 삭제를 요청했습니다.");

  const { crewId, postId } = req.params;

  console.log("user : ", req.body.userId, "params: ", req.params);

  const response = await postService.deleteCrewPost(postRequest.deleteCrewPostRequest(crewId, postId, req.body));
  // #region Swagger: 특정 크루 특정 게시글 삭제 API
  /*
    #swagger.summary = '특정 크루 특정 게시글 삭제 API';

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "number", example: "1" }
            },
            required: ["userId"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "특정 크루 특정 게시글 삭제 성공 응답",
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
                  "postId": 7,
                  "title": "게시글 작성 테스트 제목입니다.",
                  "content": "게시글 작성 테스트 내용입니다.",
                  "createdAt": "2025-07-18T03:41:07.805Z",
                  "commentCount": 0
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "특정 크루 특정 게시글 수정 실패 응답",
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

export const toggleCrewPostLike = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 좋아요를 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log("user : ", req.body.userId, "params: ", req.params);

  const response = await postService.toggleCrewPostLike(postRequest.toggleCrewPostLikeRequest(crewId, postId, req.body));
  // #region Swagger: 특정 크루 특정 게시글 좋아요 API
  /*
    #swagger.summary = '특정 크루 특정 게시글 좋아요 API';

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "number", example: "1" }
            },
            required: ["userId"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "특정 크루 특정 게시글 좋아요 성공 응답",
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
                  "postId": 2,
                  "isLiked": true,
                  "likeCount": 3,
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "특정 크루 특정 게시글 좋아요 실패 응답",
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

export const readCommentsByCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 댓글 리스트 조회를 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log(req.params);

  const response = await postService.readCommentsByCrewPost(postRequest.readCommentListRequest(crewId, postId));
  // #region Swagger: 게시글 댓글 리스트 조회 API
  /*
    #swagger.summary = '게시글 댓글 리스트 조회 API';
    #swagger.responses[200] = {
      description: "게시글 댓글 리스트 조회 성공 응답",
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
                    "commentId": 1,
                    "content": "게시글 작성 테스트 내용1 입니다.",
                    "nickname": "철수짱1",
                    "createdAt": "2025-07-20 12:13:07"
                  },
                  {
                    "commentId": 2,
                    "content": "게시글 작성 테스트 내용2 입니다.",
                    "nickname": "철수짱2",
                    "createdAt": "2025-07-20 12:13:24"
                  },
                ]
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

export const createCrewPostComment = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 댓글 작성을 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log("user : ", req.body.userId, "params: ", req.params);

  const response = await postService.createCrewPostComment(postRequest.createCrewPostCommentRequest(crewId, postId, req.body));
  // #region Swagger: 댓글 작성 API
  /*
    #swagger.summary = '댓글 작성 API';

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: { type: "string", example: "게시글 작성 테스트 내용입니다." },
              isPublic: { type: "number", example: "0" },
              userId: { type: "number", example: "1" }
            },
            required: ["content", "isPublic", "userId"]
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
              success: {
                type: "string", example: 
                {
                  "commentId": 4,
                  "content": "댓글 작성 테스트 내용입니다.",
                  "nickname": "홍길동",
                  "createdAt": "2025-07-18T02:04:54.410Z",
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

export const updateCrewPostComment = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 댓글 수정을 요청했습니다.");

  const { crewId, postId, commentId } = req.params;
  console.log(req.params);

  const response = await postService.modifyCrewPostComment(crewId, postId, commentId, updateCrewPostCommentRequest(req.body));

  res.status(StatusCodes.OK).success(response);
}

export const deleteCrewPostComment = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 특정 댓글 삭제를 요청했습니다.");

  const { crewId, postId, commentId } = req.params;
  console.log(req.params);

  const response = await postService.removeCrewPostComment(crewId, postId, commentId);

  res.status(StatusCodes.OK).success(response);
}