//notice.service.js에서 로직 가져옴
import * as noticeService from "./notice.service.js";
import {
  createNoticeRequestDto,
  updateNoticeRequestDto,
  validateNoticeIdDto,
  validateCrewIdDto,
} from "./dto/request/notice.request.dto.js";
import {
  noticeListResponseDto,
  noticeDetailResponseDto,
  noticeCreateResponseDto,
  noticeUpdateResponseDto,
  noticeDeleteResponseDto,
  noticeErrorResponseDto,
} from "./dto/response/notice.response.dto.js";
import {
  noticeLikeToggleResponseDto,
  noticeLikeErrorResponseDto,
} from "./dto/response/notice.like.response.dto.js";

//1. 공지리스트 조회
export const getNotices = async (req, res, next) => {
  try {
    const { crewId } = req.params;

    // DTO를 사용한 유효성 검증
    const validatedCrewId = validateCrewIdDto(crewId);

    // 테스트를 위해 임시로 사용자 ID를 1로 설정 (실제로는 req.user.id 사용)
    const userId = 1; // req.user?.id;

    const result = await noticeService.getNotices(validatedCrewId, userId);
    const response = noticeListResponseDto(result, validatedCrewId);
    // #region Swagger: 공지사항 리스트 조회 API
    /*
  #swagger.tags = ['Notice']
  #swagger.summary = '공지사항 리스트 조회 API'
  #swagger.description = '특정 크루의 공지사항 목록을 조회합니다.'

  #swagger.parameters['crewId'] = {
    in: 'path',
    description: '크루 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.responses[200] = {
    description: "공지사항 목록 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string", example: "공지 제목" },
                  type: { type: "integer", example: 1, description: "공지 유형 (0: 일반, 1: 필수)" },
                  createdAt: { type: "string", format: "date-time", example: "2025-07-29T12:00:00.000Z" },
                  author: { type: "string", example: "작성자" },
                  isLiked: { type: "boolean", example: false, description: "현재 사용자의 좋아요 여부" }
                }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[400] = {
    description: "공지사항 목록 조회 실패",
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
                reason: { type: "string", example: "유효하지 않은 crewId입니다." },
                data: { type: "object", nullable: true, example: null }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
*/
    // #endregion

    res.success(response);
  } catch (err) {
    next(err);
  }
};

//2. 공지작성
export const createNotice = async (req, res, next) => {
  try {
    const { crewId } = req.params;
    const noticeData = req.body;

    // DTO를 사용한 유효성 검증
    const validatedCrewId = validateCrewIdDto(crewId);
    const validatedNoticeData = createNoticeRequestDto(noticeData);

    // 테스트를 위해 임시로 사용자 ID를 1로 설정
    //const userId = req.user.id;
    const userId = 1;

    const newNotice = await noticeService.createNotice(
      validatedCrewId,
      userId,
      validatedNoticeData
    );

    const response = noticeCreateResponseDto(newNotice);
    // #region Swagger: 공지 작성 API
    /*
  #swagger.tags = ['Notice']
  #swagger.summary = '공지 작성 API'
  #swagger.description = '새로운 공지사항을 작성합니다.'

  #swagger.parameters['crewId'] = {
    in: 'path',
    description: '크루 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["title", "content", "type"],
          properties: {
            title: { type: "string", example: "공지 제목", description: "공지 제목" },
            content: { type: "string", example: "공지 내용", description: "공지 내용" },
            type: { type: "integer", example: 1, description: "공지 유형 (0: 일반, 1: 필수)", enum: [0, 1] }
          }
        }
      }
    }
  }

  #swagger.responses[201] = {
    description: "공지사항 작성 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                title: { type: "string", example: "공지 제목" },
                content: { type: "string", example: "공지 내용" },
                type: { type: "integer", example: 1, description: "공지 유형 (0: 일반, 1: 필수)" },
                createdAt: { type: "string", format: "date-time", example: "2025-07-29T12:00:00.000Z" },
                crewId: { type: "integer", example: 1 },
                crewMemberId: { type: "integer", example: 1 }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[403] = {
    description: "공지사항 작성 권한 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "FORBIDDEN" },
                reason: { type: "string", example: "공지 작성 권한이 없습니다. 크루 멤버인지 확인하세요." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
*/
    // #endregion

    res.status(201).success(response);
  } catch (err) {
    next(err);
  }
};

//3. 특정 크루 공지 상세조회
export const getNoticeDetails = async (req, res, next) => {
  try {
    const { noticeId } = req.params;

    // DTO를 사용한 유효성 검증
    const validatedNoticeId = validateNoticeIdDto(noticeId);

    // 테스트를 위해 임시로 사용자 ID를 1로 설정 (실제로는 req.user.id 사용)
    const userId = 1; // req.user?.id;

    const notice = await noticeService.getNoticeDetails(
      validatedNoticeId,
      userId
    );
    const response = noticeDetailResponseDto(notice);
    // #region Swagger: 공지사항 상세 조회 API
    /*
  #swagger.tags = ['Notice']
  #swagger.summary = '공지사항 상세 조회 API'
  #swagger.description = '특정 공지사항의 상세 정보를 조회합니다.'

  #swagger.parameters['crewId'] = {
    in: 'path',
    description: '크루 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.parameters['noticeId'] = {
    in: 'path',
    description: '공지 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.responses[200] = {
    description: "공지사항 상세 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            data: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                title: { type: "string", example: "공지 제목" },
                content: { type: "string", example: "공지 내용" },
                type: { type: "integer", example: 1, description: "공지 유형 (0: 일반, 1: 필수)" },
                createdAt: { type: "string", format: "date-time", example: "2025-07-29T12:00:00.000Z" },
                modifiedAt: { type: "string", format: "date-time", nullable: true, example: null },
                author: {
                  type: "object",
                  properties: {
                    crewMemberId: { type: "integer", example: 123, description: "작성자의 크루 멤버 ID" },
                    nickname: { type: "string", example: "작성자" },
                    image: { type: "string", nullable: true, example: null }
                  }
                },
                isLiked: { type: "boolean", example: false, description: "현재 사용자의 좋아요 여부" },
                totalLikes: { type: "integer", example: 5, description: "총 좋아요 수" },
                likedBy: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      crewMemberId: { type: "integer", example: 123, description: "좋아요를 누른 크루 멤버 ID" },
                      nickname: { type: "string", example: "사용자1", description: "좋아요를 누른 사용자 닉네임" },
                      likedAt: { type: "string", format: "date-time", example: "2025-08-12T14:50:00.000Z", description: "좋아요를 누른 시간" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[404] = {
    description: "공지사항을 찾을 수 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "NOTICE_NOT_FOUND" },
                reason: { type: "string", example: "해당 공지를 찾을 수 없습니다." },
                data: { type: "object", nullable: true, example: null }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
*/
    // #endregion

    res.success(response);
  } catch (err) {
    next(err);
  }
};

//4. 특정 크루 공지수정
export const updateNotice = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const noticeUpdateData = req.body;

    // DTO를 사용한 유효성 검증
    const validatedNoticeId = validateNoticeIdDto(noticeId);
    const validatedUpdateData = updateNoticeRequestDto(noticeUpdateData);

    // 인증 미들웨어로부터 사용자 ID 획득 (테스트를 위해 임시로 1로 설정)
    const userId = 1; // req.user?.id;

    if (!userId) {
      return res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: "사용자 인증이 필요합니다.",
      });
    }

    const updatedNotice = await noticeService.updateNotice(
      validatedNoticeId,
      userId,
      validatedUpdateData
    );

    const response = noticeUpdateResponseDto(updatedNotice);
    // #region Swagger: 공지사항 수정 API
    /*
  #swagger.tags = ['Notice']
  #swagger.summary = '공지사항 수정 API'
  #swagger.description = '특정 공지사항의 내용을 수정합니다.'

  #swagger.parameters['crewId'] = {
    in: 'path',
    description: '크루 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.parameters['noticeId'] = {
    in: 'path',
    description: '공지 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["title", "content", "type"],
          properties: {
            title: { type: "string", example: "수정된 공지 제목" },
            content: { type: "string", example: "수정된 공지 내용" },
            type: { type: "integer", example: 0, description: "공지 유형 (0: 일반, 1: 필수)", enum: [0, 1] }
          }
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: "공지사항 수정 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            data: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                title: { type: "string", example: "수정된 공지 제목" },
                content: { type: "string", example: "수정된 공지 내용" },
                type: { type: "integer", example: 0, description: "공지 유형 (0: 일반, 1: 필수)" },
                modifiedAt: { type: "string", format: "date-time", example: "2025-07-29T14:00:00.000Z" }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[401] = {
    description: "인증 필요",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "UNAUTHORIZED" },
                reason: { type: "string", example: "사용자 인증이 필요합니다." },
                data: { type: "object", nullable: true, example: null }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }

  #swagger.responses[403] = {
    description: "공지 수정 권한 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "FORBIDDEN" },
                reason: { type: "string", example: "공지를 수정할 권한이 없습니다." },
                data: { type: "object", nullable: true, example: null }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
*/
    // #endregion

    res.success(response);
  } catch (err) {
    next(err);
  }
};

//5. 특정 크루 공지삭제
export const deleteNotice = async (req, res, next) => {
  try {
    const { noticeId } = req.params;

    // DTO를 사용한 유효성 검증
    const validatedNoticeId = validateNoticeIdDto(noticeId);

    // 인증 미들웨어로부터 사용자 ID 획득 (테스트를 위해 임시로 1로 설정)
    const userId = 1; // req.user?.id;

    if (!userId) {
      return res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: "사용자 인증이 필요합니다.",
      });
    }

    await noticeService.deleteNotice(validatedNoticeId, userId);

    const response = noticeDeleteResponseDto();
    // #region Swagger: 공지사항 삭제 API
    /*
  #swagger.tags = ['Notice']
  #swagger.summary = '공지사항 삭제 API'
  #swagger.description = '특정 공지사항을 삭제합니다.'

  #swagger.parameters['crewId'] = {
    in: 'path',
    description: '크루 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.parameters['noticeId'] = {
    in: 'path',
    description: '공지 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.responses[200] = {
    description: "공지사항 삭제 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            data: {
              type: "object",
              properties: {
                message: { type: "string", example: "공지가 성공적으로 삭제되었습니다." }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[401] = {
    description: "인증 필요",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "UNAUTHORIZED" },
                reason: { type: "string", example: "사용자 인증이 필요합니다." },
                data: { type: "object", nullable: true, example: null }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }

  #swagger.responses[403] = {
    description: "공지 삭제 권한 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "FORBIDDEN" },
                reason: { type: "string", example: "공지를 삭제할 권한이 없습니다." },
                data: { type: "object", nullable: true, example: null }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
*/
    // #endregion

    res.success(response);
  } catch (err) {
    next(err);
  }
};

//6. 공지사항 좋아요 토글
export const toggleNoticeLike = async (req, res, next) => {
  try {
    const { noticeId } = req.params;

    // DTO를 사용한 유효성 검증
    const validatedNoticeId = validateNoticeIdDto(noticeId);

    // 테스트를 위해 임시로 사용자 ID를 1로 설정 (실제로는 req.user.id 사용)
    const userId = 1; // req.user?.id;

    if (!userId) {
      return res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: "사용자 인증이 필요합니다.",
      });
    }

    const result = await noticeService.toggleNoticeLike(
      validatedNoticeId,
      userId
    );
    const response = noticeLikeToggleResponseDto(
      result.isLiked,
      result.totalLikes,
      result.action,
      result.likedBy
    );

    // #region Swagger: 공지사항 좋아요 토글 API
    /*
  #swagger.tags = ['Notice']
  #swagger.summary = '공지사항 좋아요 토글 API'
  #swagger.description = '공지사항에 좋아요를 추가하거나 취소합니다.'

  #swagger.parameters['crewId'] = {
    in: 'path',
    description: '크루 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.parameters['noticeId'] = {
    in: 'path',
    description: '공지 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.responses[200] = {
    description: "좋아요 토글 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            data: {
              type: "object",
              properties: {
                isLiked: { type: "boolean", example: true, description: "현재 사용자의 좋아요 상태" },
                totalLikes: { type: "integer", example: 5, description: "총 좋아요 수" },
                action: { type: "string", example: "added", description: "수행된 액션 (added/removed)", enum: ["added", "removed"] },
                likedBy: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      crewMemberId: { type: "integer", example: 123, description: "크루 멤버 ID" },
                      likedAt: { type: "string", format: "date-time", example: "2025-08-12T14:50:00.000Z", description: "좋아요를 누른 시간" }
                    }
                  }
                },
                message: { type: "string", example: "좋아요가 추가되었습니다.", description: "결과 메시지" }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[401] = {
    description: "인증 필요",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "UNAUTHORIZED" },
                reason: { type: "string", example: "사용자 인증이 필요합니다." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }

  #swagger.responses[403] = {
    description: "권한 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "FORBIDDEN" },
                reason: { type: "string", example: "크루 멤버만 좋아요를 누를 수 있습니다." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }

  #swagger.responses[404] = {
    description: "공지사항을 찾을 수 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "NOTICE_NOT_FOUND" },
                reason: { type: "string", example: "해당 공지를 찾을 수 없습니다." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
*/
    // #endregion

    res.success(response);
  } catch (err) {
    next(err);
  }
};
