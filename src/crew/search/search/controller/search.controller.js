import { StatusCodes } from "http-status-codes";
import {
  bodyToAdvancedSearch,
  bodyToDefaultSearch,
  bodyToGetByCategory,
} from "../dto/request/search.request.dto.js";
import {
  crewAdvancedSearch,
  crewDefaultSearch,
  crewSearchByCategory,
} from "../service/search.service.js";
import { InvalidInputValueError } from "../../../../error.js";

/**
 * **[Crew Search]**
 *  **\<Controller\>**
 *  ***handleDefaultSearch***
 *  '크루명으로 검색' 기능 담당 API의 컨트롤러
 */
export const handleDefaultSearch = async (req, res, next) => {
  /*
        #swagger.summary = "크루명으로 검색"
        #swagger.tags = ["Crew Search"]
        #swagger.parameters['name'] = {
            in: 'query',
            description: "크루 검색어",
            required:true,
            example:"모임"
        };
        #swagger.parameters['capacity'] = {
            in: 'query',
            description: "크루 최대 인원수",
            required:false,
            example:"10"
        };
        #swagger.parameters['page'] = {
            in: 'query',
            description: "페이지 번호",
            required:true,
            example:"1"
        };
        #swagger.parameters['sort'] = {
            in: 'query',
            description: "정렬 방식 (1 : 최신순, 2 : 활동 많은 순, 3 : 맴버 수(오름차 순), 4 : 맴버 수(내림차 순))",
            required:true,
            example:"1"
        };
        #swagger.responses[200] = {
            description: "크루 이름으로 검색 성공 응답",
            content: {
                "application/json" :{
                    schema: {
                        type: "object",
                        properties :{
                            resultType: { type: "string", example: "SUCCESS" },
                            error: { type: "object", nullable: true, example: null},
                            success: {
                                type: "object",
                                properties: {
                                    crews:{
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id:{ type: "number", example:1 },
                                                name:{ type: "string", example: "UMC Study 모임"},
                                                description:{ type: "string", example: "스터디 모집합니다."},
                                                introduction:{ type: "string", example: "함께 성장해요!"},
                                                score:{ type:"Number", example: 4.15},
                                                capacity:{type:"number", example:10},
                                                memberCount:{type:"number", example:1},
                                                noticeCount:{type:"number", example:1},
                                                postCount:{type:"number", example:5},
                                                bannerImage:{type:"string", example:"banner.jpg"},
                                                ageLimit:{type:"number", example:20},
                                                genderLimit:{type:"number", example:1},
                                                ownerName:{type:"string", example:"홍길동"},
                                                crewCategory:{type:"string", example:"스터디"},
                                                crewActivity:{
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                        example: "온라인"
                                                    }
                                                },
                                                crewStyle:{
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                        example: "목표지향"
                                                    }
                                                },
                                                regionSido:{type:"string", example:"서울특별시"},
                                                regionGu:{type:"string", example:"성북구"},
                                            }
                                        }
                                    },
                                    count:{
                                        type: "number",
                                        example: 1
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        #swagger.responses[400] = {
        description: "크루 이름으로 검색 실패 응답 (올바르지 않은 검색어)",
        content:{
            "application/json": {
            examples:{
                InvalidSearchQuery :{
                    summary:"올바르지 않은 검색어",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 검색어를 입력해주세요.",
                            "data": {
                                "name": "",
                                "capacity": "10",
                                "page": "1",
                                "sort": "1",
                            }
                        }
                    }
                },
                InvalidPage : {
                    summary:"올바르지 않은 페이지 번호",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 페이지를 지정해주세요.",
                            "data": {
                                "name":"모임",
                                "capacity": "10",
                                "page":"abc",
                                "sort":"1",
                            }
                        }
                    }
                },
                InvalidSortType : {
                    summary:"올바르지 않은 정렬 방식",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 정렬 방식을 지정해주세요.",
                            "data": {
                                "name": "모임",
                                "page": "1",
                                "capacity": "10",
                                "sort": "abc"
                            }
                        }
                    }
                },
                InvalidCapacity:{
                    summary:"올바르지 않은 인원수",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 인원수를 지정해주세요.",
                            "data": {
                                "name": "모임",
                                "page": "1",
                                "capacity": "abc",
                                "sort": "1"
                            }
                        }
                    }
                }
            }
            }
        }
        };
    */
  console.log("크루명 검색이 요청되었습니다!");
  console.log("query:", req.query);
  // 정렬 방식이 올바르게 지정되지 않은경우 에러 throw
  if (
    req.query.page == undefined ||
    isNaN(Number(req.query.sort)) ||
    Number(req.query.sort) <= 0 ||
    Number(req.query.sort) >= 5
  ) {
    throw new InvalidInputValueError(
      "올바른 정렬 방식을 지정해주세요.",
      req.query,
    );
  }
  // 페이지가 올바르게 지정되지 않은 경우 에러 throw
  if (
    req.query.page == undefined ||
    isNaN(Number(req.query.page)) ||
    Number(req.query.page) < 0
  ) {
    throw new InvalidInputValueError(
      "올바른 페이지를 지정해주세요.",
      req.query,
    );
  }
  // 검색어가 올바르게 지정되지 않은 경우 에러 throw
  if (req.query.name == undefined || req.query.name == "") {
    throw new InvalidInputValueError(
      "올바른 검색어를 입력해주세요.",
      req.query,
    );
  }
  // 인원수가 올바르게 지정되지 않은 경우 에러 throw
  if (
    req.query.capacity != undefined &&
    (isNaN(Number(req.query.capacity)) || Number(req.query.capacity) < 0)
  ) {
    throw new InvalidInputValueError(
      "올바른 인원수를 입력해주세요.",
      req.query,
    );
  }
  // 서비스 레이어에 검색 요청후 결과값 반환
  const search = await crewDefaultSearch(bodyToDefaultSearch(req.query));
  // 200 응답과 결과값 반환
  res.status(StatusCodes.OK).success(search);
};
/**
 * **[Crew Search]**
 *  **\<Controller\>**
 *  ***handleAdvancedSearch***
 *  '크루 찾아보기 (고급 검색)' 기능 담당 API의 컨트롤러
 */
export const handleAdvancedSearch = async (req, res, next) => {
  /*
    #swagger.summary = "크루 찾아보기 (고급 검색)"
    #swagger.tags = ["Crew Search"]
    #swagger.parameters['name'] = {
        in: 'query',
        description: "크루 검색어",
        required:false,
        example:"모임"
    };
    #swagger.parameters['category'] = {
        in: 'query',
        description: "크루 카테고리",
        required:false,
        example:"1"
    };
    #swagger.parameters['activity'] = {
        in: 'query',
        description: "크루 액티비티",
        required:false,
        example:"1,2,3"
    };
    #swagger.parameters['style'] = {
        in: 'query',
        description: "크루 스타일",
        required:false,
        example:"1,2"
    };
    #swagger.parameters['region'] = {
        in: 'query',
        description: "크루 지역",
        required:false,
        example:"1"
    };
    #swagger.parameters['age'] = {
        in: 'query',
        description: "크루 연령대 제한",
        required:false,
        example:"1"
    };
    #swagger.parameters['gender'] = {
        in: 'query',
        description: "크루 성별 제한",
        required:false,
        example:"1"
    };
    #swagger.parameters['page'] = {
        in: 'query',
        description: "페이지 번호",
        required:true,
        example:"1"
    };
    #swagger.parameters['capacity'] = {
        in: 'query',
        description: "크루 최대 인원수",
        required:false,
        example:"10"
    };
    #swagger.parameters['sort'] = {
        in: 'query',
        description: "정렬 방식 (1 : 최신순, 2 : 활동 많은 순, 3 : 맴버 수(오름차 순), 4 : 맴버 수(내림차 순))",
        required:true,
        example:"1"
    };
    #swagger.responses[200] = {
        description: "크루 찾아보기 성공 응답",
        content: {
            "application/json" :{
                schema: {
                    type: "object",
                    properties :{
                        resultTupe: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null},
                        success: {
                            type: "object",
                            properties: {
                                crews:{
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id:{ type: "number", example:1 },
                                            name:{ type: "string", example: "UMC Study 모임"},
                                            description:{ type: "string", example: "스터디 모집합니다."},
                                            introduction:{ type: "string", example: "함께 성장해요!"},
                                            score:{ type:"Number", example: 4.15},
                                            capacity:{type:"number", example:10},
                                            memberCount:{type:"number", example:1},
                                            noticeCount:{type:"number", example:1},
                                            postCount:{type:"number", example:5},
                                            bannerImage:{type:"string", example:"banner.jpg"},
                                            ageLimit:{type:"number", example:1},
                                            genderLimit:{type:"number", example:1},
                                            ownerName:{type:"string", example:"홍길동"},
                                            crewCategory:{type:"string", example:"스터디"},
                                            crewActivity:{
                                                type: "array",
                                                items: {
                                                    type: "string",
                                                    example: "온라인"
                                                }
                                            },
                                            crewStyle:{
                                                type: "array",
                                                items: {
                                                    type: "string",
                                                    example: "목표지향"
                                                }
                                            },
                                            regionSido:{type:"string", example:"서울특별시"},
                                            regionGu:{type:"string", example:"성북구"},
                                        }
                                    }
                                },
                                count: {
                                    type:"number",
                                    example:1
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
    description: "크루 이름으로 검색 실패 응답 (올바르지 않은 검색 옵션)",
    content:{
        "application/json": {
        examples:{
                InvalidNameInput :{
                    summary:"올바르지 않은 크루명",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 크루명을 입력해주세요.",
                            "data": {
                                "name": "",
                                "category": "1",
                                "style": "1,2",
                                "region": "1",
                                "age": "1",
                                "gender": "1",
                                "activity": "1,2,3",
                                "page": "1",
                                "sort": "1"
                            }
                        }
                    }
                },
                InvalidCategory : {
                    summary:"올바르지 않은 크루 카테고리",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 카테고리를 입력해주세요.",
                            "data": {
                                "name": "모임",
                                "category": "a,b,c",
                                "style": "1,2",
                                "region": "1",
                                "age": "1",
                                "gender": "1",
                                "activity": "1,2,3",
                                "page": "1",
                                "sort": "1"
                            }
                        }
                    }
                },
                InvalidRegion : {
                    summary:"올바르지 않은 지역",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 지역을 입력해주세요.",
                            "data": {
                                "name": "모임",
                                "category": "1,2,3",
                                "style": "1,2",
                                "region": "a",
                                "age": "1",
                                "gender": "1",
                                "activity": "1,2,3",
                                "page": "1",
                                "sort": "1"
                            }
                        }
                    }
                },
                InvalidGender : {
                    summary:"올바르지 않은 성별 제한",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 성별을 입력해주세요.",
                            "data": {
                                "name": "모임",
                                "category": "1,2,3",
                                "style": "1,2",
                                "region": "1",
                                "age": "1",
                                "gender": "a",
                                "activity": "1,2,3",
                                "page": "1",
                                "sort": "1"
                            }
                        }
                    }
                },
                InvalidAge : {
                    summary:"올바르지 않은 연령대 제한",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 연령대를 입력해주세요.",
                            "data": {
                                "name": "모임",
                                "category": "1,2,3",
                                "style": "1,2",
                                "region": "1",
                                "age": "a",
                                "gender": "1",
                                "activity": "1,2,3",
                                "page": "1",
                                "sort": "1"
                            }
                        }
                    }
                },
                InvalidStyle : {
                    summary:"올바르지 않은 크루 스타일",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 스타일을 입력해주세요.",
                            "data": {
                                "name": "모임",
                                "category": "1,2,3",
                                "style": "a,b",
                                "region": "1",
                                "age": "1",
                                "gender": "1",
                                "activity": "1,2,3",
                                "page": "1",
                                "sort": "1"
                            }
                        }
                    }
                },
                InvalidActivity : {
                    summary:"올바르지 않은 크루 액티비티",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 액티비티를 입력해주세요.",
                            "data": {
                                "name": "모임",
                                "category": "1,2,3",
                                "style": "1,2",
                                "region": "1",
                                "age": "1",
                                "gender": "1",
                                "activity": "a,b,c",
                                "page": "1",
                                "sort": "1"
                            }
                        }
                    }
                },
                EmptyOptions : {
                    summary:"옵션이 선택되지 않음",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "최소 하나이상의 옵션을 선택/입력 해주세요.",
                            "data": {
                                "page": "1",
                                "sort": "1"
                            }
                        }
                    }
                },
                InvalidPage : {
                    summary:"올바르지 않은 페이지 번호",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 페이지를 지정해주세요.",
                            "data": {
                                "page": "abc",
                                "sort": "1"
                            }
                        }
                    }
                },
                InvalidSortType : {
                    summary:"올바르지 않은 정렬 방식",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 정렬 방식을 지정해주세요.",
                            "data": {
                                "page": "1",
                                "sort": "abc"
                            }
                        }
                    }
                },
                InvalidCapacity : {
                    summary:"올바르지 않은 인원수",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 인원수를 입력해주세요.",
                            "data": {
                                "page": "1",
                                "sort": "1",
                                "capacity": "abc"
                            }
                        }
                    }
                },
            }
        }

    }
    };
*/
  console.log("크루 고급 검색이 요청되었습니다!");
  console.log("query:", req.query);
  // 올바른 페이지가 지정되지 않은경우 에러 throw
  if (
    req.query.page == undefined ||
    isNaN(Number(req.query.page)) ||
    Number(req.query.page) < 0
  ) {
    throw new InvalidInputValueError(
      "올바른 페이지를 지정해주세요.",
      req.query,
    );
  }
  // 올바른 정렬방식이 지정되지 않은 경우 에러 throw
  if (
    req.query.sort == undefined ||
    isNaN(Number(req.query.sort)) ||
    Number(req.query.sort) <= 0 ||
    Number(req.query.sort) >= 5
  ) {
    throw new InvalidInputValueError(
      "올바른 정렬 방식을 지정해주세요.",
      req.query,
    );
  }
  // 인원수가 올바르게 지정되지 않은 경우 에러 throw
  if (
    req.query.capacity != undefined &&
    (isNaN(Number(req.query.capacity)) || Number(req.query.capacity) < 0)
  ) {
    throw new InvalidInputValueError(
      "올바른 인원수를 입력해주세요.",
      req.query,
    );
  }
  // 단 하나의 옵션도 지정되지 않은경우 에러 throw
  // if (
  //   Object.keys(req.query).length == 2 &&
  //   Object.keys(req.query).indexOf("page") != -1 &&
  //   Object.keys(req.query).indexOf("sort") != -1
  // ) {
  //   throw new InvalidInputValueError(
  //     "최소 하나이상의 옵션을 선택/입력 해주세요.",
  //     req.query,
  //   );
  // }
  // 크루명이 제대로 입력되지 않은 경우 에러 throw
  if (req.query.name != undefined && req.query.name == "") {
    throw new InvalidInputValueError(
      "올바른 크루명을 입력해주세요.",
      req.query,
    );
  }
  // 카테고리가 올바르게 지정되지 않은 경우 에러 throw
  if (req.query.category != undefined && isNaN(Number(req.query.category))) {
    throw new InvalidInputValueError(
      "올바른 카테고리를 입력해주세요.",
      req.query,
    );
  }
  // 지역이 올바르게 지정되지 않은 경우 에러 throw
  if (req.query.region != undefined && isNaN(Number(req.query.region))) {
    throw new InvalidInputValueError("올바른 지역을 입력해주세요.", req.query);
  }
  // 성별이 올바르게 지정되지 않은 경우 에러 throw
  if (req.query.gender != undefined && isNaN(Number(req.query.gender))) {
    throw new InvalidInputValueError("올바른 성별을 입력해주세요.", req.query);
  }
  // 연령대가 올바르게 지정되지 않은 경우 에러 throw
  if (req.query.age != undefined && isNaN(Number(req.query.age))) {
    throw new InvalidInputValueError(
      "올바른 연령대를 입력해주세요.",
      req.query,
    );
  }
  // 올바르게 스타일을 지정하지 않은 경우 에러 throw
  if (
    req.query.style != undefined &&
    !req.query.style.split(",").every((style) => !isNaN(Number(style)))
  ) {
    throw new InvalidInputValueError(
      "올바른 스타일을 입력해주세요.",
      req.query,
    );
  }
  // 올바르게 엑티비티를 지정하지 않은 경우 에러 throw
  if (
    req.query.activity != undefined &&
    !req.query.activity.split(",").every((activity) => !isNaN(Number(activity)))
  ) {
    throw new InvalidInputValueError(
      "올바른 액티비티를 입력해주세요.",
      req.query,
    );
  }
  // 서비스 레이어에 검색 요청후 결과값 반환
  const search = await crewAdvancedSearch(bodyToAdvancedSearch(req.query));
  // 200 응답과 결과값 반환
  res.status(StatusCodes.OK).success(search);
};
/**
 * **[Crew Search]**
 *  **\<Controller\>**
 *  ***handleGetByCategory***
 *  '크루 카테고리로 조회' 기능 담당 API의 컨트롤러
 */
export const handleGetByCategory = async (req, res) => {
  /*
    #swagger.tags = ['Crew Search']
    #swagger.summary = '크루 카테고리로 조회'
    #swagger.parameters['category'] = {
        in: 'query',
        description: "크루 카테고리",
        required:true,
        example:"1"
    };
    #swagger.parameters['capacity'] = {
        in: 'query',
        description: "크루 최대 인원수",
        required:false,
        example:"10"
    };
    #swagger.parameters['page'] = {
        in: 'query',
        description: "페이지 번호",
        required:true,
        example:"1"
    };
    #swagger.parameters['sort'] = {
        in: 'query',
        description: "정렬 방식 (1 : 최신순, 2 : 활동 많은 순, 3 : 맴버 수(오름차 순), 4 : 맴버 수(내림차 순))",
        required:true,
        example:"1"
    };
    #swagger.responses[200] = {
        description: "크루 찾아보기 성공 응답",
        content: {
            "application/json" :{
                schema: {
                    type: "object",
                    properties :{
                        resultTupe: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null},
                        success: {
                            type: "object",
                            properties: {
                                crews:{
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id:{ type: "number", example:1 },
                                            name:{ type: "string", example: "UMC Study 모임"},
                                            description:{ type: "string", example: "스터디 모집합니다."},
                                            introduction:{ type: "string", example: "함께 성장해요!"},
                                            capacity:{type:"number", example:10},
                                            memberCount:{type:"number", example:1},
                                            score:{ type:"Number", example: 4.15},
                                            noticeCount:{type:"number", example:1},
                                            postCount:{type:"number", example:5},
                                            bannerImage:{type:"string", example:"banner.jpg"},
                                            ageLimit:{type:"number", example:1},
                                            genderLimit:{type:"number", example:1},
                                            ownerName:{type:"string", example:"홍길동"},
                                            crewCategory:{type:"string", example:"스터디"},
                                            crewActivity:{
                                                type: "array",
                                                items: {
                                                    type: "string",
                                                    example: "온라인"
                                                }
                                            },
                                            crewStyle:{
                                                type: "array",
                                                items: {
                                                    type: "string",
                                                    example: "목표지향"
                                                }
                                            },
                                            regionSido:{type:"string", example:"서울특별시"},
                                            regionGu:{type:"string", example:"성북구"},
                                        }
                                    }
                                },
                                count: {
                                    type:"number",
                                    example:1
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
    description: "크루 이름으로 검색 실패 응답 (올바르지 않은 검색 옵션)",
    content:{
        "application/json": {
        examples:{
                InvalidCategory : {
                    summary:"올바르지 않은 크루 카테고리",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 카테고리를 입력해주세요.",
                            "data": {
                                "category": "a",
                                "page": "1",
                                "sort": "1",
                                capacity: "10"
                            }
                        }
                    }
                },
                InvalidPage : {
                    summary:"올바르지 않은 페이지 번호",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 페이지를 지정해주세요.",
                            "data": {
                                "category": "1",
                                "page": "abc",
                                "sort": "1",
                                capacity: "10"
                            }
                        }
                    }
                },
                InvalidSortType : {
                    summary:"올바르지 않은 정렬 방식",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 정렬 방식을 지정해주세요.",
                            "data": {
                                "category": "1",
                                "page": "1",
                                "sort": "abc",
                                capacity: "10"
                            }
                        }
                    }
                },
                InvalidCapacity : {
                    summary:"올바르지 않은 인원수",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 인원수를 입력해주세요.",
                            "data": {
                                "category": "1",
                                "page": "1",
                                "sort": "1",
                                "capacity": "abc"
                            }
                        }
                    }
                },
            }
        }

    }
    };
  */
  // 카테고리가 올바르게 지정되지 않은 경우 에러 throw
  if (
    req.query.category != undefined &&
    (isNaN(Number(req.query.category)) || Number(req.query.category) < 1)
  ) {
    throw new InvalidInputValueError(
      "올바른 카테고리를 입력해주세요.",
      req.query,
    );
  }
  // 올바른 페이지가 지정되지 않은경우 에러 throw
  if (
    req.query.page == undefined ||
    isNaN(Number(req.query.page)) ||
    Number(req.query.page) < 0
  ) {
    throw new InvalidInputValueError(
      "올바른 페이지를 지정해주세요.",
      req.query,
    );
  }
  // 인원수가 올바르게 지정되지 않은 경우 에러 throw
  if (
    req.query.capacity != undefined &&
    (isNaN(Number(req.query.capacity)) || Number(req.query.capacity) < 0)
  ) {
    throw new InvalidInputValueError(
      "올바른 인원수를 입력해주세요.",
      req.query,
    );
  }
  // 올바른 정렬방식이 지정되지 않은 경우 에러 throw
  if (
    req.query.sort == undefined ||
    isNaN(Number(req.query.sort)) ||
    Number(req.query.sort) <= 0 ||
    Number(req.query.sort) >= 5
  ) {
    throw new InvalidInputValueError(
      "올바른 정렬 방식을 지정해주세요.",
      req.query,
    );
  }
  // 서비스 레이어에 검색 요청후 결과값 반환
  const search = await crewSearchByCategory(bodyToGetByCategory(req.query));
  // 200 응답과 결과값 반환
  res.status(StatusCodes.OK).success(search);
};
