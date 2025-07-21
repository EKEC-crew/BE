import { getPopularCrewList, getLatestCrewList } from "../service/list.service.js";

async function handlePopularCrewList(req, res, next) {
    /*
        #swagger.summary = "인기 크루 리스트 조회"
        #swagger.tags = ["Crew List"]
        #swagger.responses[200] = {
            description: "인기 크루 리스트 조회 성공 응답",
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
                                    crews: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "number", example: 1 },
                                                title: { type: "string", example: "사이클링히트" },
                                                introduction: { type: "string", example: "잠실 2030 여성 야구 직관 동호회" },
                                                crewCategory: { type: "string", example: "스포츠직관" },
                                                regionSido: { type: "string", example: "서울특별시" },
                                                regionGu: { type: "string", example: "송파구" },
                                                bannerImage: { type: "string", example: "/images/banner_01.jpg" },
                                                postCount: { type: "number", example: 12 },
                                                createdAt: { type: "string", format: "date-time", example: "2025-07-01T10:00:00Z" },
                                                crewActivity: {
                                                    type: "array",
                                                    items: { type: "string", example: "정기모임" }
                                                },
                                                crewStyle: {
                                                    type: "array",
                                                    items: { type: "string", example: "친목" }
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
        }
        #swagger.responses[500] = {
            description: "서버 오류",
            content: {
                "application/json": {
                    example: {
                        resultType: "FAIL",
                        error: {
                            errorCode: "E001",
                            reason: "서버 내부 오류"
                        }
                    }
                }
            }
        }
    */
    try {
        const data = await getPopularCrewList();
        res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                crews: data
            }
        });
    } catch (error) {
        next(error);
    }
}

async function handleLatestCrewList(req, res, next) {
    /*
        #swagger.summary = "최신 크루 리스트 조회"
        #swagger.tags = ["Crew List"]
        #swagger.responses[200] = {
            description: "최신 크루 리스트 조회 성공 응답",
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
                                    crews: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "number", example: 1 },
                                                title: { type: "string", example: "사이클링히트" },
                                                introduction: { type: "string", example: "잠실 2030 여성 야구 직관 동호회" },
                                                crewCategory: { type: "string", example: "스포츠직관" },
                                                regionSido: { type: "string", example: "서울특별시" },
                                                regionGu: { type: "string", example: "송파구" },
                                                bannerImage: { type: "string", example: "/images/banner_01.jpg" },
                                                postCount: { type: "number", example: 12 },
                                                createdAt: { type: "string", format: "date-time", example: "2025-07-01T10:00:00Z" },
                                                crewActivity: {
                                                    type: "array",
                                                    items: { type: "string", example: "정기모임" }
                                                },
                                                crewStyle: {
                                                    type: "array",
                                                    items: { type: "string", example: "친목" }
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
        }
        #swagger.responses[500] = {
            description: "서버 오류",
            content: {
                "application/json": {
                    example: {
                        resultType: "FAIL",
                        error: {
                            errorCode: "E001",
                            reason: "서버 내부 오류"
                        }
                    }
                }
            }
        }
    */
    try {
        const data = await getLatestCrewList();
        res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                crews: data
            }
        });
    } catch (error) {
        next(error);
    }
}

export {
    handlePopularCrewList,
    handleLatestCrewList
};
