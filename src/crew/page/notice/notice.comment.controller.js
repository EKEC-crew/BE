import * as noticeCommentService from "./notice.comment.service.js";
import {
  createCommentRequestDto,
  updateCommentRequestDto,
  validateCommentIdDto,
  validateNoticeIdDto,
  validateCrewIdDto,
} from "./dto/request/notice.comment.request.dto.js";
import {
  commentListResponseDto,
  commentDetailResponseDto,
  commentCreateResponseDto,
  commentUpdateResponseDto,
  commentDeleteResponseDto,
  likeResponseDto,
  unlikeResponseDto,
} from "./dto/response/notice.comment.response.dto.js";

/*
 * 1. 공지 좋아요
 */
// #swagger.tags = ['Notice Like']
// #swagger.description = '공지사항에 좋아요를 추가합니다.'
// #swagger.parameters['crewId'] = {
//   in: 'path',
//   description: '크루 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.parameters['noticeId'] = {
//   in: 'path',
//   description: '공지 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.responses[200] = {
//   description: '좋아요 추가 성공',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'SUCCESS' },
//           error: { type: 'object', nullable: true, example: null },
//           success: {
//             type: 'object',
//             properties: {
//               message: { type: 'string', example: '좋아요가 추가되었습니다.' }
//             }
//           }
//         }
//       }
//     }
//   }
// }
// #swagger.responses[400] = {
//   description: '이미 좋아요를 눌렀음',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'FAIL' },
//           error: {
//             type: 'object',
//             properties: {
//               errorCode: { type: 'string', example: 'ALREADY_LIKED' },
//               reason: { type: 'string', example: '이미 좋아요를 눌렀습니다.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
export const likeNotice = async (req, res, next) => {
  try {
    const { crewId, noticeId } = req.params;
    const validatedCrewId = validateCrewIdDto(crewId);
    const validatedNoticeId = validateNoticeIdDto(noticeId);
    const userId = 1; // req.user?.id; // 테스트를 위해 임시로 사용자 ID를 1로 설정

    const result = await noticeCommentService.likeNotice(
      validatedCrewId,
      validatedNoticeId,
      userId
    );
    const response = likeResponseDto();
    res.success(response);
  } catch (err) {
    next(err);
  }
};

/*
 * 1-1. 공지 좋아요 취소
 */
// #swagger.tags = ['Notice Like']
// #swagger.description = '공지사항의 좋아요를 취소합니다.'
// #swagger.parameters['crewId'] = {
//   in: 'path',
//   description: '크루 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.parameters['noticeId'] = {
//   in: 'path',
//   description: '공지 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.responses[200] = {
//   description: '좋아요 취소 성공',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'SUCCESS' },
//           error: { type: 'object', nullable: true, example: null },
//           success: {
//             type: 'object',
//             properties: {
//               message: { type: 'string', example: '좋아요가 취소되었습니다.' }
//             }
//           }
//         }
//       }
//     }
//   }
// }
// #swagger.responses[404] = {
//   description: '좋아요를 찾을 수 없음',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'FAIL' },
//           error: {
//             type: 'object',
//             properties: {
//               errorCode: { type: 'string', example: 'LIKE_NOT_FOUND' },
//               reason: { type: 'string', example: '좋아요를 찾을 수 없습니다.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
export const unlikeNotice = async (req, res, next) => {
  try {
    const { crewId, noticeId } = req.params;
    const validatedCrewId = validateCrewIdDto(crewId);
    const validatedNoticeId = validateNoticeIdDto(noticeId);
    const userId = 1; // req.user?.id; // 테스트를 위해 임시로 사용자 ID를 1로 설정

    const result = await noticeCommentService.unlikeNotice(
      validatedCrewId,
      validatedNoticeId,
      userId
    );
    const response = unlikeResponseDto();
    res.success(response);
  } catch (err) {
    next(err);
  }
};

/*
 * 2. 공지 댓글 목록 조회
 */
// #swagger.tags = ['Notice Comment']
// #swagger.description = '공지사항의 댓글 목록을 조회합니다.'
// #swagger.parameters['crewId'] = {
//   in: 'path',
//   description: '크루 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.parameters['noticeId'] = {
//   in: 'path',
//   description: '공지 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.responses[200] = {
//   description: '댓글 목록 조회 성공',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'SUCCESS' },
//           error: { type: 'object', nullable: true, example: null },
//           success: {
//             type: 'object',
//             properties: {
//               message: { type: 'string', example: '댓글 목록입니다.' },
//               data: {
//                 type: 'array',
//                 items: {
//                   type: 'object',
//                   properties: {
//                     id: { type: 'integer', example: 1 },
//                     content: { type: 'string', example: '댓글 내용' },
//                     createdAt: { type: 'string', format: 'date-time' },
//                     author: { type: 'string', example: '작성자' }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }
export const getComments = async (req, res, next) => {
  try {
    const { crewId, noticeId } = req.params;

    // DTO를 사용한 유효성 검증
    const validatedCrewId = validateCrewIdDto(crewId);
    const validatedNoticeId = validateNoticeIdDto(noticeId);

    const result = await noticeCommentService.getComments(validatedNoticeId);
    const response = commentListResponseDto(result, validatedNoticeId);

    res.success(response);
  } catch (err) {
    next(err);
  }
};

/*
 * 3. 공지 댓글 작성
 */
// #swagger.tags = ['Notice Comment']
// #swagger.description = '공지사항에 댓글을 작성합니다.'
// #swagger.parameters['crewId'] = {
//   in: 'path',
//   description: '크루 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.parameters['noticeId'] = {
//   in: 'path',
//   description: '공지 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.requestBody = {
//   required: true,
//   content: {
//     "application/json": {
//       schema: {
//         type: "object",
//         properties: {
//           content: { type: "string", example: "댓글 내용", description: "댓글 내용" }
//         },
//         required: ["content"]
//       }
//     }
//   }
// }
// #swagger.responses[201] = {
//   description: '댓글 작성 성공',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'SUCCESS' },
//           error: { type: 'object', nullable: true, example: null },
//           success: {
//             type: 'object',
//             properties: {
//               id: { type: 'integer', example: 1 },
//               content: { type: 'string', example: '댓글 내용' },
//               createdAt: { type: 'string', format: 'date-time' },
//               noticeId: { type: 'integer', example: 1 },
//               crewMemberId: { type: 'integer', example: 1 }
//             }
//           }
//         }
//       }
//     }
//   }
// }
export const createComment = async (req, res, next) => {
  try {
    const { crewId, noticeId } = req.params;
    const commentData = req.body;

    // DTO를 사용한 유효성 검증
    const validatedCrewId = validateCrewIdDto(crewId);
    const validatedNoticeId = validateNoticeIdDto(noticeId);
    const validatedCommentData = createCommentRequestDto(commentData);

    // 테스트를 위해 임시로 사용자 ID를 1로 설정
    const userId = 1; // req.user?.id;

    const newComment = await noticeCommentService.createComment(
      validatedCrewId,
      validatedNoticeId,
      userId,
      validatedCommentData
    );

    const response = commentCreateResponseDto(newComment);
    res.status(201).success(response);
  } catch (err) {
    next(err);
  }
};

/*
 * 4. 공지 댓글 수정
 */
// #swagger.tags = ['Notice Comment']
// #swagger.description = '공지사항의 댓글을 수정합니다.'
// #swagger.parameters['crewId'] = {
//   in: 'path',
//   description: '크루 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.parameters['noticeId'] = {
//   in: 'path',
//   description: '공지 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.parameters['commentId'] = {
//   in: 'path',
//   description: '댓글 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.requestBody = {
//   required: true,
//   content: {
//     "application/json": {
//       schema: {
//         type: "object",
//         properties: {
//           content: { type: "string", example: "수정된 댓글 내용" }
//         },
//         required: ["content"]
//       }
//     }
//   }
// }
// #swagger.responses[200] = {
//   description: '댓글 수정 성공',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'SUCCESS' },
//           error: { type: 'object', nullable: true, example: null },
//           success: {
//             type: 'object',
//             properties: {
//               id: { type: 'integer', example: 1 },
//               content: { type: 'string', example: '수정된 댓글 내용' },
//               modifiedAt: { type: 'string', format: 'date-time' }
//             }
//           }
//         }
//       }
//     }
//   }
// }
// #swagger.responses[401] = {
//   description: '인증 필요',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'FAIL' },
//           error: {
//             type: 'object',
//             properties: {
//               errorCode: { type: 'string', example: 'UNAUTHORIZED' },
//               reason: { type: 'string', example: '사용자 인증이 필요합니다.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
// #swagger.responses[403] = {
//   description: '권한 없음',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'FAIL' },
//           error: {
//             type: 'object',
//             properties: {
//               errorCode: { type: 'string', example: 'FORBIDDEN' },
//               reason: { type: 'string', example: '댓글을 수정할 권한이 없습니다.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const commentUpdateData = req.body;

    // DTO를 사용한 유효성 검증
    const validatedCommentId = validateCommentIdDto(commentId);
    const validatedUpdateData = updateCommentRequestDto(commentUpdateData);

    // 인증 미들웨어로부터 사용자 ID 획득 (테스트를 위해 임시로 1로 설정)
    const userId = 1; // req.user?.id;

    if (!userId) {
      return res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: "사용자 인증이 필요합니다.",
      });
    }

    const updatedComment = await noticeCommentService.updateComment(
      validatedCommentId,
      userId,
      validatedUpdateData
    );

    const response = commentUpdateResponseDto(updatedComment);
    res.success(response);
  } catch (err) {
    next(err);
  }
};

/*
 * 5. 공지 댓글 삭제
 */
// #swagger.tags = ['Notice Comment']
// #swagger.description = '공지사항의 댓글을 삭제합니다.'
// #swagger.parameters['crewId'] = {
//   in: 'path',
//   description: '크루 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.parameters['noticeId'] = {
//   in: 'path',
//   description: '공지 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.parameters['commentId'] = {
//   in: 'path',
//   description: '댓글 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.responses[200] = {
//   description: '댓글 삭제 성공',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'SUCCESS' },
//           error: { type: 'object', nullable: true, example: null },
//           success: {
//             type: 'object',
//             properties: {
//               message: { type: 'string', example: '댓글이 성공적으로 삭제되었습니다.' }
//             }
//           }
//         }
//       }
//     }
//   }
// }
// #swagger.responses[401] = {
//   description: '인증 필요',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'FAIL' },
//           error: {
//             type: 'object',
//             properties: {
//               errorCode: { type: 'string', example: 'UNAUTHORIZED' },
//               reason: { type: 'string', example: '사용자 인증이 필요합니다.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
// #swagger.responses[403] = {
//   description: '권한 없음',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'FAIL' },
//           error: {
//             type: 'object',
//             properties: {
//               errorCode: { type: 'string', example: 'FORBIDDEN' },
//               reason: { type: 'string', example: '댓글을 삭제할 권한이 없습니다.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    // DTO를 사용한 유효성 검증
    const validatedCommentId = validateCommentIdDto(commentId);

    // 인증 미들웨어로부터 사용자 ID 획득 (테스트를 위해 임시로 1로 설정)
    const userId = 1; // req.user?.id;

    if (!userId) {
      return res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: "사용자 인증이 필요합니다.",
      });
    }

    await noticeCommentService.deleteComment(validatedCommentId, userId);

    const response = commentDeleteResponseDto();
    res.success(response);
  } catch (err) {
    next(err);
  }
};
