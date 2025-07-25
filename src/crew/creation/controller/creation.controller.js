import {StatusCodes} from "http-status-codes";
import {createNewCrew} from "../service/creation.service.js";
import {bodyToCreateNewCrew} from "../dto/request/creation.request.dto.js";

/**
 * **[Crew Creation]**
 *  **\<Controller\>**
 *  ***handleCreateCrew***
 *  '크루 생성' 기능 담당 API의 컨트롤러
 */
export const handleCreateCrew = async (req, res, next) => {
    /*
        #swagger.summary = "크루 생성"
        #swagger.tags = ["Crew Creation"]
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            bannerImage: {
                                type:"string",
                                format:"binary"
                            },
                            crewInfo: {
                                type: "object",
                                properties: {
                                    name: {type: "string", example: "새로운 크루"},
                                    description: {type: "string", example: "가족같은 분위기의 크루"},
                                    maxCapacity: {type: "number", example:10},
                                    category: {type: "number", example:1},
                                    activities: {
                                        type: "array",
                                        items:{
                                            type: "number",
                                            example: 1
                                        }
                                    },
                                    styles: {
                                        type: "array",
                                        items:{
                                            type: "number",
                                            example: 1
                                        }
                                    },
                                    region:{type: "number", example: 1},
                                    age:{type: "number", example: 1},
                                    gender:{type: "number", example: 0},
                                    recruitMessage: {type: "string", example:"선택해주셔서 감사합니다!"},
                                    admin:{type: "number", example: 1}
                                }
                            },
                            applicationForm: {
                                type: "object",
                                properties: {
                                    questions: {
                                        type: "array",
                                        items:{
                                            type: "object",
                                            properties: {
                                                question:{type: "string", example:"어떤경로로 이 크루를 가입하시게 되셨나요?"},
                                                type:{type: "number", example:0},
                                                choices:{
                                                    type: "array",
                                                    items: {
                                                        type:"string",
                                                        example:"지인 추천"
                                                    }
                                                },
                                                etc:{type: "number", example:1},
                                                required:{type: "number", example:1}
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
        #swagger.responses[201] = {
            description: "크루 생성 성공 응답",
            content: {
                "application/json" :{
                    schema: {
                        type: "object",
                        properties :{
                            resultType: {type: "string", example: "SUCCESS"},
                            error: { type: "object", nullable: true, example: null},
                            data: {
                                type: "object",
                                properties: {
                                    crewId: {type: "number", example:1}
                                }
                            }
                        }
                    }
                }
            }
        }
     */
    req.body.crewInfo = JSON.parse(req.body.crewInfo);
    req.body.applicationForm = JSON.parse(req.body.applicationForm);
    console.log("크루 생성이 요청되었습니다!")
    console.log("body:", req.body);

    const crew = await createNewCrew(bodyToCreateNewCrew(req.body, req.file));
    res.status(StatusCodes.CREATED).success(crew);
}