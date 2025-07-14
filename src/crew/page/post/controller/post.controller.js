import { StatusCodes } from "http-status-codes";
import * as postRequest from "../dto/request/post.request.dto.js";
import * as postService from "../service/post.service.js";

export const readPostsByCrew = async (req, res, next) => {
  console.log("특정 크루 게시글 리스트 조회를 요청했습니다.");

  const { crewId } = req.params;

  const response = await postService.getPostsByCrew(postRequest.useCrewIdRequest(crewId));
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
              success: {
                type: "string", example: "read post list complete"
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
  const { userId } = req.user;
  console.log("user : ", userId, "\n", "params: ", req.params);

  const response = await postService.addCrewPost(postRequest.createCrewPostRequest(userId, crewId, req.body));

  res.status(StatusCodes.OK).success(response);
}

export const readCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 상세 조회를 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log(req.params);

  const response = await postService.getCrewPost(postRequest.useCrewAndPostIdRequest(crewId, postId));

  res.status(StatusCodes.OK).success(response);
}

export const updateCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 수정을 요청했습니다.");

  const { crewId, postId } = req.params;
  const { userId } = req.user;

  console.log(req.params);

  const response = await postService.modifyCrewPost(postRequest.updateCrewPostRequest(userId, crewId, postId, req.body));

  res.status(StatusCodes.OK).success(response);
}

export const deleteCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 삭제를 요청했습니다.");

  const { crewId, postId } = req.params;
  const { userId } = req.user;

  console.log(req.params);

  const response = await postService.removeCrewPost(crewId, postId);

  res.status(StatusCodes.OK).success(response);
}

export const toggleCrewPostLike = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 좋아요를 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log(req.params);

  const response = await postService.likeCrewPost(crewId, postId);

  res.status(StatusCodes.OK).success(response);
}

export const readCommentsByCrewPost = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 댓글 리스트 조회를 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log(req.params);

  const response = await postService.getCommentsByCrewPost(crewId, postId);

  res.status(StatusCodes.OK).success(response);
}

export const createCrewPostComment = async (req, res, next) => {
  console.log("특정 크루 특정 게시글 댓글 작성을 요청했습니다.");

  const { crewId, postId } = req.params;
  console.log(req.params);

  const response = await postService.addCrewPostComment(crewId, postId, createCrewPostCommentRequest(req.body));

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