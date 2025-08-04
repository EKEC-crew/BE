import { StatusCodes } from "http-status-codes";
import * as postRequest from "../dto/request/post.request.dto.js";
import * as postService from "../service/post.service.js";
import * as baseError from "../../../../error.js";

export const readPostsByCrew = async (req, res, next) => {
  console.log("특정 크루 게시글 리스트 조회를 요청했습니다.");

  const { crewId } = req.params;
  const page = req.query.page || 1;
  const size = req.query.size || 10;

  const response = await postService.readPostsByCrew(postRequest.readPostListRequest(crewId, page, size));
  // #region Swagger: 게시글 리스트 조회 API
  /*
    #swagger.summary = '게시글 리스트 조회 API';
    #swagger.tags = ["Crew Post"]
    #swagger.parameters['page'] = { in: 'query', required: false, type: 'integer', description: '페이지 번호 (기본1)' }
    #swagger.parameters['size'] = { in: 'query', required: false, type: 'integer', description: '페이지 크기 (기본10)' }
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
                type: "string", example:{
                "posts": [
                      {
                        "postId": 9,
                        "title": "게시글 제목입니다",h
                        "createdAt": "2025-08-04 18:33:37",
                        "nickname": "이병차은우",
                        "commentCount": 0,
                        "likeCount": 1,
                        "imageCount": 0,
                        "isPopular": true
                      },
                      {
                        "postId": 25,
                        "title": "게시글 제목입니다",
                        "createdAt": "2025-08-04 18:33:43",
                        "nickname": "이병차은우",
                        "commentCount": 0,
                        "likeCount": 0,
                        "imageCount": 0,
                        "isPopular": false
                      },
                      {
                        "postId": 24,
                        "title": "게시글 제목입니다",
                        "createdAt": "2025-08-04 18:33:42",
                        "nickname": "이병차은우",
                        "commentCount": 0,
                        "likeCount": 0,
                        "imageCount": 0,
                        "isPopular": false
                      },
                      {
                        "postId": 23,
                        "title": "게시글 제목입니다",
                        "createdAt": "2025-08-04 18:33:42",
                        "nickname": "이병차은우",
                        "commentCount": 0,
                        "likeCount": 0,
                        "imageCount": 0,
                        "isPopular": false
                      },
                      {
                        "postId": 22,
                        "title": "게시글 제목입니다",
                        "createdAt": "2025-08-04 18:33:42",
                        "nickname": "이병차은우",
                        "commentCount": 0,
                        "likeCount": 0,
                        "imageCount": 0,
                        "isPopular": false
                      }
                    ],
                    "hasNext": true
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

export const createCrewPost = async (req, res, next) => {
  console.log("특정 크루 게시글 작성을 요청했습니다.");
  const { crewId } = req.params;

  const validImageExtensions = ["jpg", "jpeg", "png", "gif"];
  if (req.files.some(file => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    return !validImageExtensions.includes(ext);
  })
  ) {
    throw new baseError.InvalidInputValueError("올바른 이미지를 등록 해 주세요.", req.body);
  }

  const response = await postService.createCrewPost(postRequest.createCrewPostRequest(crewId, req.body, req.files));
  // #region Swagger: 게시글 작성 API
  /*
    #swagger.summary = '게시글 작성 API';
    #swagger.tags = ["Crew Post"]
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              images: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary"
                }
              },
              title: { type: "string", example: "게시글 제목입니다" },
              content: { type: "string", example: "게시글 내용입니다" },
              userId: { type: "number", example: 1 }
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
              data: {
                type: "string", example: 
                {
                  "postId": 19,
                  "title": "입력한 게시글 제목",
                  "content": "입력한 게시글 내용",
                  "createdAt": "2025-07-31T10:27:17.103Z",
                  "nickname": "차은우",
                  "profileImage": "profile1.jpg",
                  "commentCount": 0,
                  "likeCount": 0,
                  isPopular: false,
                  "images": [
                    {
                      "imageId": 21,
                      "imageName": "95befbe2-a17e-44a9-bd1f-4708fa9fbd27.png"
                    },
                    {
                      "imageId": 22,
                      "imageName": "2e4b97b8-41a3-4686-997b-fc04dea279b2.png"
                    }
                  ]
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

export const readCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 상세 조회를 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log(req.params);

  const response = await postService.readCrewPost(
    postRequest.readPostRequest(crewId, postId)
  );
  // #region Swagger: 특정 크루 특정 게시글 상세 조회 API
  /*
    #swagger.summary = '특정 크루 특정 게시글 상세 조회 API';
    #swagger.tags = ["Crew Post"]
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
                  "postId": 19,
                  "title": "조회한 게시글 제목",
                  "content": "조회한 게시글 내용",
                  "createdAt": "2025-07-31T10:27:17.103Z",
                  "nickname": "차은우",
                  "profileImage": "profile1.jpg",
                  "commentCount": 0,
                  "likeCount": 0,
                  isPopular: false,
                  "images": [
                    {
                      "imageId": 21,
                      "imageName": "95befbe2-a17e-44a9-bd1f-4708fa9fbd27.png"
                    },
                    {
                      "imageId": 22,
                      "imageName": "2e4b97b8-41a3-4686-997b-fc04dea279b2.png"
                    }
                  ]
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
};

export const updateCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 수정을 요청했습니다.");

  const { crewId, postId } = req.params;

  const validImageExtensions = ["jpg", "jpeg", "png", "gif"];
  if (req.files.some(file => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    return !validImageExtensions.includes(ext);
  })
  ) {
    throw new baseError.InvalidInputValueError("올바른 이미지를 등록 해 주세요.", req.body);
  }

  const response = await postService.updateCrewPost(
    postRequest.updateCrewPostRequest(crewId, postId, req.body, req.files)
  );
  // #region Swagger: 특정 크루 특정 게시글 수정 API
  /*
    #swagger.summary = '특정 크루 특정 게시글 수정 API';
    #swagger.tags = ["Crew Post"]
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              images: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary"
                }
              },
              existingImageIds:{
                type: "array",
                items: { type: "number"},
                example: [1, 3]
              },
              title: { type: "string", example: "게시글 제목입니다" },
              content: { type: "string", example: "게시글 내용입니다" },
              userId: { type: "number", example: 1 }
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
                  "postId": 19,
                  "title": "수정된 게시글 제목",
                  "content": "수정된 게시글 내용",
                  "createdAt": "2025-07-31T10:27:17.103Z",
                  "nickname": "차은우",
                  "profileImage": "profile1.jpg",
                  "commentCount": 0,
                  "likeCount": 0,
                  isPopular: false,
                  "images": [
                    {
                      "imageId": 21,
                      "imageName": "95befbe2-a17e-44a9-bd1f-4708fa9fbd27.png"
                    },
                    {
                      "imageId": 22,
                      "imageName": "2e4b97b8-41a3-4686-997b-fc04dea279b2.png"
                    }
                  ]
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
};

export const deleteCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 삭제를 요청했습니다.");

  const { crewId, postId } = req.params;

  console.log("user : ", req.body.userId, "params: ", req.params);

  const response = await postService.deleteCrewPost(
    postRequest.deleteCrewPostRequest(crewId, postId, req.body)
  );
  // #region Swagger: 특정 크루 특정 게시글 삭제 API
  /*
    #swagger.summary = '특정 크루 특정 게시글 삭제 API';
    #swagger.tags = ["Crew Post"]
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
              data: {
                type: "string", example: 
                {
                  success: true
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

  res.status(StatusCodes.OK).success({ success: true });
};

export const toggleCrewPostLike = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 좋아요를 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log("user : ", req.body.userId, "params: ", req.params);

  const response = await postService.toggleCrewPostLike(
    postRequest.toggleCrewPostLikeRequest(crewId, postId, req.body)
  );
  // #region Swagger: 특정 크루 특정 게시글 좋아요 API
  /*
    #swagger.summary = '특정 크루 특정 게시글 좋아요 API';
    #swagger.tags = ["Crew Post"]
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
};

export const readCommentsByCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 댓글 리스트 조회를 요청했습니다.");

  const { crewId, postId } = req.params;
  const page = req.query.page || 1;
  const size = req.query.size || 5;
  console.log(req.params);

  const response = await postService.readCommentsByCrewPost(postRequest.readCommentListRequest(crewId, postId, page, size));
  // #region Swagger: 게시글 댓글 리스트 조회 API
  /*
    #swagger.summary = '게시글 댓글 리스트 조회 API';
    #swagger.tags = ["Crew Post"]
    #swagger.parameters['page'] = { in: 'query', required: false, type: 'integer', description: '페이지 번호 (기본1)' }
    #swagger.parameters['size'] = { in: 'query', required: false, type: 'integer', description: '페이지 크기 (기본5)' }
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
                    "createdAt": "2025-07-20 12:13:07",
                    "nickname": "길동이",
                    "image": "profile.jpg",
                  },
                  {
                    "commentId": 2,
                    "content": "게시글 작성 테스트 내용2 입니다.",
                    "nickname": "철수짱2",
                    "createdAt": "2025-07-20 12:13:24",
                    "nickname": "길동이",
                    "image": "profile.jpg",
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
};

export const createCrewPostComment = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 댓글 작성을 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log("user : ", req.body.userId, "params: ", req.params);

  const response = await postService.createCrewPostComment(
    postRequest.createCrewPostCommentRequest(crewId, postId, req.body)
  );
  // #region Swagger: 댓글 작성 API
  /*
    #swagger.summary = '댓글 작성 API';
    #swagger.tags = ["Crew Post"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: { type: "string", example: "댓글 작성 테스트 내용입니다." },
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
                  "nickname": "길동이",
                  "image": "profile.jpg",
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

export const updateCrewPostComment = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 댓글 수정을 요청했습니다.");

  const { crewId, postId, commentId } = req.params;
  console.log("user : ", req.body.userId, "params: ", req.params);

  const response = await postService.updateCrewPostComment(
    postRequest.updateCrewPostCommentRequest(
      crewId,
      postId,
      commentId,
      req.body
    )
  );
  // #region Swagger: 특정 댓글 수정 API
  /*
    #swagger.summary = '특정 댓글 수정 API';
    #swagger.tags = ["Crew Post"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: { type: "string", example: "댓글 수정 테스트 내용입니다." },
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
                  "commentId": 3,
                  "content": "댓글 수정 테스트 내용입니다.",
                  "nickname": "홍길동",
                  "createdAt": "2025-07-18 02:04:54.410",
                  "nickname": "길동이",
                  "image": "profile.jpg",
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

export const deleteCrewPostComment = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 특정 댓글 삭제를 요청했습니다.");

  const { crewId, postId, commentId } = req.params;
  console.log("user : ", req.body.userId, "params: ", req.params);

  const response = await postService.deleteCrewPostComment(
    postRequest.deleteCrewPostCommentRequest(
      crewId,
      postId,
      commentId,
      req.body
    )
  );
  // #region Swagger: 특정 댓글 삭제 API
  /*
    #swagger.summary = '특정 댓글 삭제 API';
    #swagger.tags = ["Crew Post"]
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
      description: "특정 댓글 삭제 성공 응답",
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
                  "commentId": 3,
                  "content": "삭제된 댓글의 내용입니다.",
                  "nickname": "홍길동",
                  "createdAt": "2025-07-18 02:04:54.410",
                  "nickname": "길동이",
                  "image": "profile.jpg",
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
};
