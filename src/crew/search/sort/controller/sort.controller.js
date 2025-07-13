import { StatusCodes } from "http-status-codes"
import sortService from '../service/sort.service.js';
import { createSortedCrewResponse } from '../dto/response/sort.response.dto.js';

const getLatestCrews = async (req, res, next) => {
  /*
  #swagger.summary = "최신순 정렬된 크루 목록 조회"
  #swagger.tags = ["Crew Sort"]

  #swagger.parameters['page'] = {
    in: 'query',
    description: "페이지 번호",
    required: false,
    type: "integer",
    example: 1
  }

  #swagger.parameters['limit'] = {
    in: 'query',
    description: "페이지당 항목 수",
    required: false,
    type: "integer",
    example: 10
  }

  #swagger.parameters['capacity'] = {
    in: 'query',
    description: "필터링할 최소 인원수 (예: 30 → 30명 이상 크루만)",
    required: false,
    type: "integer",
    example: 0
  }

  #swagger.responses[200] = {
    description: "정렬된 크루 목록 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", example: null },
            success: {
              type: "object",
              properties: {
                totalCount: { type: "integer", example: 42 },
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                crews: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "string", example: "UMC 크루 모집" },
                      content: { type: "string", example: "함께 성장해요!" },
                      bannerImage: { type: "string", example: "banner.jpg" },
                      crewCapacity: { type: "integer", example: 10 },
                      postCount: { type: "integer", example: 5 }
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

  #swagger.responses[400] = {
  description: "잘못된 요청",
  content: {
    "application/json": {
      examples: {
        InvalidPage: {
          summary: "유효하지 않은 페이지 번호",
          value: {
            resultType: "FAIL",
            error: {
              errorCode: "I001",
              reason: "올바른 페이지 번호를 입력해주세요.",
              data: { page: "abc" }
            },
            success: null
          }
        },
        UnsupportedSort: {
          summary: "지원하지 않는 정렬 기준",
          value: {
            resultType: "FAIL",
            error: {
              errorCode: "S001",
              reason: "지원하지 않는 정렬 방식입니다.",
              data: { path: "/unknown" }
            },
            success: null
          }
        }
      }
    }
  }
}

  #swagger.responses[500] = {
    description: "서버 오류",
    content: {
      "application/json": {
        example: {
          resultType: "ERROR",
          error: {
            errorCode: "INTERNAL_SERVER_ERROR",
            reason: "정렬 중 서버 오류가 발생했습니다.",
            data: null
          },
          success: null
        }
      }
    }
  }
*/
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const capacity = req.query.capacity ? parseInt(req.query.capacity) : null;

    const data = await sortService.getSortedCrews(req.route.path, +page, +limit, capacity);

    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: createSortedCrewResponse(data.totalCount, page, limit, data.crews),
    });
  } catch (err) {
    next(err);
  }
};

const getPopularCrews = async (req, res, next) => {
  /*
  #swagger.summary = "인기순 정렬된 크루 목록 조회"
  #swagger.tags = ["Crew Sort"]

  #swagger.parameters['page'] = {
    in: 'query',
    description: "페이지 번호",
    required: false,
    type: "integer",
    example: 1
  }

  #swagger.parameters['limit'] = {
    in: 'query',
    description: "페이지당 항목 수",
    required: false,
    type: "integer",
    example: 10
  }

  #swagger.parameters['capacity'] = {
    in: 'query',
    description: "필터링할 최소 인원수 (예: 30 → 30명 이상 크루만)",
    required: false,
    type: "integer",
    example: 0
  }

  #swagger.responses[200] = {
    description: "정렬된 크루 목록 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", example: null },
            success: {
              type: "object",
              properties: {
                totalCount: { type: "integer", example: 42 },
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                crews: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "string", example: "UMC 크루 모집" },
                      content: { type: "string", example: "함께 성장해요!" },
                      bannerImage: { type: "string", example: "banner.jpg" },
                      crewCapacity: { type: "integer", example: 10 },
                      postCount: { type: "integer", example: 5 }
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

  #swagger.responses[400] = {
  description: "잘못된 요청",
  content: {
    "application/json": {
      examples: {
        InvalidPage: {
          summary: "유효하지 않은 페이지 번호",
          value: {
            resultType: "FAIL",
            error: {
              errorCode: "I001",
              reason: "올바른 페이지 번호를 입력해주세요.",
              data: { page: "abc" }
            },
            success: null
          }
        },
        UnsupportedSort: {
          summary: "지원하지 않는 정렬 기준",
          value: {
            resultType: "FAIL",
            error: {
              errorCode: "S001",
              reason: "지원하지 않는 정렬 방식입니다.",
              data: { path: "/unknown" }
            },
            success: null
          }
        }
      }
    }
  }
}

  #swagger.responses[500] = {
    description: "서버 오류",
    content: {
      "application/json": {
        example: {
          resultType: "ERROR",
          error: {
            errorCode: "INTERNAL_SERVER_ERROR",
            reason: "정렬 중 서버 오류가 발생했습니다.",
            data: null
          },
          success: null
        }
      }
    }
  }
*/
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const capacity = req.query.capacity ? parseInt(req.query.capacity) : null;

    const data = await sortService.getSortedCrews(req.route.path, +page, +limit, capacity);

    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: createSortedCrewResponse(data.totalCount, page, limit, data.crews),
    });
  } catch (err) {
    next(err);
  }
};

const getMemberAscCrews = async (req, res, next) => {
  /*
  #swagger.summary = "인원 적은 순 정렬된 크루 목록 조회"
  #swagger.tags = ["Crew Sort"]

  #swagger.parameters['page'] = {
    in: 'query',
    description: "페이지 번호",
    required: false,
    type: "integer",
    example: 1
  }

  #swagger.parameters['limit'] = {
    in: 'query',
    description: "페이지당 항목 수",
    required: false,
    type: "integer",
    example: 10
  }

  #swagger.parameters['capacity'] = {
    in: 'query',
    description: "필터링할 최소 인원수 (예: 30 → 30명 이상 크루만)",
    required: false,
    type: "integer",
    example: 0
  }

  #swagger.responses[200] = {
    description: "정렬된 크루 목록 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", example: null },
            success: {
              type: "object",
              properties: {
                totalCount: { type: "integer", example: 42 },
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                crews: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "string", example: "UMC 크루 모집" },
                      content: { type: "string", example: "함께 성장해요!" },
                      bannerImage: { type: "string", example: "banner.jpg" },
                      crewCapacity: { type: "integer", example: 10 },
                      postCount: { type: "integer", example: 5 }
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

  #swagger.responses[400] = {
  description: "잘못된 요청",
  content: {
    "application/json": {
      examples: {
        InvalidPage: {
          summary: "유효하지 않은 페이지 번호",
          value: {
            resultType: "FAIL",
            error: {
              errorCode: "I001",
              reason: "올바른 페이지 번호를 입력해주세요.",
              data: { page: "abc" }
            },
            success: null
          }
        },
        UnsupportedSort: {
          summary: "지원하지 않는 정렬 기준",
          value: {
            resultType: "FAIL",
            error: {
              errorCode: "S001",
              reason: "지원하지 않는 정렬 방식입니다.",
              data: { path: "/unknown" }
            },
            success: null
          }
        }
      }
    }
  }
}

  #swagger.responses[500] = {
    description: "서버 오류",
    content: {
      "application/json": {
        example: {
          resultType: "ERROR",
          error: {
            errorCode: "INTERNAL_SERVER_ERROR",
            reason: "정렬 중 서버 오류가 발생했습니다.",
            data: null
          },
          success: null
        }
      }
    }
  }
*/
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const capacity = req.query.capacity ? parseInt(req.query.capacity) : null;

    const data = await sortService.getSortedCrews(req.route.path, +page, +limit, capacity);
    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: createSortedCrewResponse(data.totalCount, page, limit, data.crews),
    });
  } catch (err) {
    next(err);
  }
};

const getMemberDescCrews = async (req, res, next) => {
  /*
  #swagger.summary = "인원 많은 순 정렬된 크루 목록 조회"
  #swagger.tags = ["Crew Sort"]

  #swagger.parameters['page'] = {
    in: 'query',
    description: "페이지 번호",
    required: false,
    type: "integer",
    example: 1
  }

  #swagger.parameters['limit'] = {
    in: 'query',
    description: "페이지당 항목 수",
    required: false,
    type: "integer",
    example: 10
  }

  #swagger.parameters['capacity'] = {
    in: 'query',
    description: "필터링할 최소 인원수 (예: 30 → 30명 이상 크루만)",
    required: false,
    type: "integer",
    example: 0
  }

  #swagger.responses[200] = {
    description: "정렬된 크루 목록 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", example: null },
            success: {
              type: "object",
              properties: {
                totalCount: { type: "integer", example: 42 },
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                crews: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "string", example: "UMC 크루 모집" },
                      content: { type: "string", example: "함께 성장해요!" },
                      bannerImage: { type: "string", example: "banner.jpg" },
                      crewCapacity: { type: "integer", example: 10 },
                      postCount: { type: "integer", example: 5 }
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

  #swagger.responses[400] = {
  description: "잘못된 요청",
  content: {
    "application/json": {
      examples: {
        InvalidPage: {
          summary: "유효하지 않은 페이지 번호",
          value: {
            resultType: "FAIL",
            error: {
              errorCode: "I001",
              reason: "올바른 페이지 번호를 입력해주세요.",
              data: { page: "abc" }
            },
            success: null
          }
        },
        UnsupportedSort: {
          summary: "지원하지 않는 정렬 기준",
          value: {
            resultType: "FAIL",
            error: {
              errorCode: "S001",
              reason: "지원하지 않는 정렬 방식입니다.",
              data: { path: "/unknown" }
            },
            success: null
          }
        }
      }
    }
  }
}

  #swagger.responses[500] = {
    description: "서버 오류",
    content: {
      "application/json": {
        example: {
          resultType: "ERROR",
          error: {
            errorCode: "INTERNAL_SERVER_ERROR",
            reason: "정렬 중 서버 오류가 발생했습니다.",
            data: null
          },
          success: null
        }
      }
    }
  }
*/
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const capacity = req.query.capacity ? parseInt(req.query.capacity) : null;

    const data = await sortService.getSortedCrews(req.route.path, +page, +limit, capacity);
    return res.status(200).json({
      resultType: 'SUCCESS',
      error: null,
      success: createSortedCrewResponse(data.totalCount, page, limit, data.crews),
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getLatestCrews,
  getPopularCrews,
  getMemberAscCrews,
  getMemberDescCrews,
};
