import { StatusCodes } from "http-status-codes"
import { bodyToAdvancedSearch, bodyToDefaultSearch } from "../dto/request/search.request.dto.js";
import { crewAdvancedSearch, crewDefaultSearch } from "../service/search.service.js";
import { InvaildInputValueError } from "../../../../error.js";

export const handleDefaultSearch = async (req, res, next) => {
    /*
        #swagger.summary = "크루명으로 검색"
        #swagger.parameters['name'] = {
            in: 'query',
            description: "크루 검색어",
            required:true,
            example:"모임"
        }
        #swagger.responses[200] = {
            description: "크루 이름으로 검색 성공 응답",
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
            schema: {
                type: "object",
                properties: {
                resultType: { type: "string", example: "FAIL"},
                error: {
                    type: "object",
                    properties: {
                    errorCode: {type:"string", example:"I001"},
                    reason: {type:"string", example:"올바른 검색어를 입력해주세요."},
                    data: {
                        type: "object",
                        properties: {
                            name:{type:"string", example:""}
                        }
                    }
                    }
                },
                success: { type: "object", nullable: true, example: null }
                }
            },
            }
        }
        };
    */
    console.log("크루명 검색이 요청되었습니다!")
    console.log("query:", req.query);

    if (req.query.name == undefined || req.query.name == "") {
        throw new InvaildInputValueError("올바른 검색어를 입력해주세요.", req.query);
    }

    const search = await crewDefaultSearch(bodyToDefaultSearch(req.query));
    res.status(StatusCodes.OK).success(search);
}
export const handleAdvancedSearch = async (req, res, next) => {
    /*
    #swagger.summary = "크루 찾아보기 (고급 검색)"
    #swagger.parameters['name'] = {
        in: 'query',
        description: "크루 검색어",
        required:false,
        example:"모임"
    }
    #swagger.parameters['category'] = {
        in: 'query',
        description: "크루 카테고리",
        required:false,
        example:"1"
    }
    #swagger.parameters['activity'] = {
        in: 'query',
        description: "크루 액티비티",
        required:false,
        example:"1,2,3"
    }
    #swagger.parameters['style'] = {
        in: 'query',
        description: "크루 스타일",
        required:false,
        example:"1,2"
    }
    #swagger.parameters['region'] = {
        in: 'query',
        description: "크루 지역",
        required:false,
        example:"1"
    }
    #swagger.parameters['age'] = {
        in: 'query',
        description: "크루 연령대 제한",
        required:false,
        example:"1"
    }
    #swagger.parameters['gender'] = {
        in: 'query',
        description: "크루 성별 제한",
        required:false,
        example:"1"
    }
    #swagger.parameters['page'] = {
        in: 'query',
        description: "페이지 번호",
        required:true,
        example:"1"
    }
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
                InvaildNameInput :{
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
                                "page": "1"
                            }
                        }
                    }
                },
                InvaildCategory : {
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
                                "page": "1"
                            }
                        }
                    }
                },
                InvaildRegion : {
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
                                "page": "1"
                            }
                        }
                    }
                },
                InvaildGender : {
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
                                "page": "1"
                            }
                        }
                    }
                },
                InvaildAge : {
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
                                "page": "1"
                            }
                        }
                    }
                },
                InvaildStyle : {
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
                                "page": "1"
                            }
                        }
                    }
                },
                InvaildActivity : {
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
                                "page": "1"
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
                            "data": {}
                        }
                    }
                },
                InvaildPage : {
                    summary:"올바르지 않은 페이지 번호",
                    value:{
                        resultType: "FAIL",
                        "error": {
                            errorCode : "I001",
                            reason: "올바른 페이지를 지정해주세요.",
                            "data": {}
                        }
                    }
                },
            }
        }
        
    }
    };
*/
    console.log("크루 고급 검색이 요청되었습니다!")
    console.log("query:", req.query);
    if (req.query.page == undefined || isNaN(Number(req.query.page))) {
        throw new InvaildInputValueError("올바른 페이지를 지정해주세요.", req.query);
    }
    if (Object.keys(req.query).length == 1 && Object.keys(req.query)[0] == "page") {
        throw new InvaildInputValueError("최소 하나이상의 옵션을 선택/입력 해주세요.", req.query);
    }
    if (req.query.name != undefined && req.query.name == "") {
        throw new InvaildInputValueError("올바른 크루명을 입력해주세요.", req.query);
    }
    if (req.query.category != undefined && isNaN(Number(req.query.category))) {
        throw new InvaildInputValueError("올바른 카테고리를 입력해주세요.", req.query);
    }
    if (req.query.region != undefined && isNaN(Number(req.query.region))) {
        throw new InvaildInputValueError("올바른 지역을 입력해주세요.", req.query);
    }
    if (req.query.gender != undefined && isNaN(Number(req.query.gender))) {
        throw new InvaildInputValueError("올바른 성별을 입력해주세요.", req.query);
    }
    if (req.query.age != undefined && isNaN(Number(req.query.age))) {
        throw new InvaildInputValueError("올바른 연령대를 입력해주세요.", req.query);
    }
    if (req.query.style != undefined && !(req.query.style.split(',').every(style => !isNaN(Number(style))))) {
        throw new InvaildInputValueError("올바른 스타일을 입력해주세요.", req.query);
    }
    if (req.query.activity != undefined && !(req.query.activity.split(',').every(activity => !isNaN(Number(activity))))) {
        throw new InvaildInputValueError("올바른 액티비티를 입력해주세요.", req.query);
    }
    const search = await crewAdvancedSearch(bodyToAdvancedSearch(req.query));
    res.status(StatusCodes.OK).success(search);
}