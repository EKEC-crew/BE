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

/*
 * 1. 공지 리스트 조회
 */
// #swagger.tags = ['Notice']
// #swagger.description = '특정 크루의 공지사항 목록을 조회합니다.'
// #swagger.parameters['crewId'] = {
//   in: 'path',
//   description: '크루 ID',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.responses[200] = {
//   description: '공지사항 목록 조회 성공',
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
//               message: { type: 'string', example: 'Crew 1의 공지사항 목록입니다.' },
//               data: {
//                 type: 'array',
//                 items: {
//                   type: 'object',
//                   properties: {
//                     id: { type: 'integer', example: 1 },
//                     title: { type: 'string', example: '공지 제목' },
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
export const getNotices = async (req, res, next) => {
  try {
    const { crewId } = req.params;

    // DTO를 사용한 유효성 검증
    const validatedCrewId = validateCrewIdDto(crewId);

    const result = await noticeService.getNotices(validatedCrewId);
    const response = noticeListResponseDto(result, validatedCrewId);

    res.success(response);
  } catch (err) {
    next(err);
  }
};

/*
 * 2. 공지 작성
 */
// #swagger.tags = ['Notice']
// #swagger.description = '새로운 공지사항을 작성합니다.'
// #swagger.parameters['crewId'] = {
//   in: 'path',
//   description: '크루 ID',
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
//           title: { type: "string", example: "공지 제목", description: "공지 제목" },
//           content: { type: "string", example: "공지 내용", description: "공지 내용" }
//         },
//         required: ["title", "content"]
//       }
//     }
//   }
// }
// #swagger.responses[201] = {
//   description: '공지사항 작성 성공',
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
//               title: { type: 'string', example: '공지 제목' },
//               content: { type: 'string', example: '공지 내용' },
//               createdAt: { type: 'string', format: 'date-time' },
//               crewId: { type: 'integer', example: 1 },
//               crewMemberId: { type: 'integer', example: 1 }
//             }
//           }
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
//               reason: { type: 'string', example: '공지 작성 권한이 없습니다. 크루 멤버인지 확인하세요.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
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
    res.status(201).success(response);
  } catch (err) {
    next(err);
  }
};

/*
 * 3. 특정 크루 공지 상세 조회
 */
// #swagger.tags = ['Notice']
// #swagger.description = '특정 공지사항의 상세 정보를 조회합니다.'
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
//   description: '공지사항 상세 조회 성공',
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
//               title: { type: 'string', example: '공지 제목' },
//               content: { type: 'string', example: '공지 내용' },
//               createdAt: { type: 'string', format: 'date-time' },
//               modifiedAt: { type: 'string', format: 'date-time', nullable: true },
//               author: {
//                 type: 'object',
//                 properties: {
//                   nickname: { type: 'string', example: '작성자' },
//                   image: { type: 'string', nullable: true, example: null }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }
// #swagger.responses[404] = {
//   description: '공지사항을 찾을 수 없음',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           resultType: { type: 'string', example: 'FAIL' },
//           error: {
//             type: 'object',
//             properties: {
//               errorCode: { type: 'string', example: 'NOTICE_NOT_FOUND' },
//               reason: { type: 'string', example: '해당 공지를 찾을 수 없습니다.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
export const getNoticeDetails = async (req, res, next) => {
  try {
    const { noticeId } = req.params;

    // DTO를 사용한 유효성 검증
    const validatedNoticeId = validateNoticeIdDto(noticeId);

    const notice = await noticeService.getNoticeDetails(validatedNoticeId);
    const response = noticeDetailResponseDto(notice);

    res.success(response);
  } catch (err) {
    next(err);
  }
};

/*
 * 4. 특정 크루 공지 수정
 */
// #swagger.tags = ['Notice']
// #swagger.description = '공지사항을 수정합니다.'
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
//           title: { type: "string", example: "수정된 공지 제목" },
//           content: { type: "string", example: "수정된 공지 내용" }
//         },
//         required: ["title", "content"]
//       }
//     }
//   }
// }
// #swagger.responses[200] = {
//   description: '공지사항 수정 성공',
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
//               title: { type: 'string', example: '수정된 공지 제목' },
//               content: { type: 'string', example: '수정된 공지 내용' },
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
//               reason: { type: 'string', example: '공지를 수정할 권한이 없습니다.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
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
    res.success(response);
  } catch (err) {
    next(err);
  }
};

/*
 * 5. 특정 크루 공지 삭제
 */
// #swagger.tags = ['Notice']
// #swagger.description = '공지사항을 삭제합니다.'
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
//   description: '공지사항 삭제 성공',
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
//               message: { type: 'string', example: '공지가 성공적으로 삭제되었습니다.' }
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
//               reason: { type: 'string', example: '공지를 삭제할 권한이 없습니다.' }
//             }
//           },
//           success: { type: 'object', nullable: true, example: null }
//         }
//       }
//     }
//   }
// }
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
    res.success(response);
  } catch (err) {
    next(err);
  }
};
