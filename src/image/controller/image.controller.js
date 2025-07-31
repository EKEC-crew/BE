import { generatePresignedURL } from "../service/image.service.js";
import { bodyToGetImageURL } from "../dto/request/image.request.dto.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import { InvalidInputValueError, UnavailableImageError } from "../../error.js";

/**
 * **[Image]**
 *  **\<🕹️ Controller\>**
 *  ***handleGetImageURL***
 *  '이미지 로드' 기능 담당 API의 컨트롤러
 */
export const handleGetImageURL = async (req, res, next) => {
    // #region 📚 Swagger: 이미지 로드
    /*
        #swagger.summary = "이미지 로드"
        #swagger.tags = ["Image"]
        #swagger.parameters['type'] = {
            in: 'query',
            description: "이미지 종류 (0 : 배너이미지, 1 : 프로필 이미지)",
            required: true,
            example: "0"
        }
        #swagger.parameters['fileName'] = {
            in: 'query',
            description: "이미지 파일 명",
            required: true,
            example: "example.jpg"
        },
        #swagger.responses[200] = {
            description: "이미지 로드 성공 응답",
            content:{
                "image/jpeg" :{
                    schema: {
                        type: "string",
                        format: "binary"
                    }
                },
                "image/png" :{
                    schema: {
                        type: "string",
                        format: "binary"
                    }
                },
                "image/gif" : {
                    schema: {
                        type: "string",
                        format: "binary"
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: "이미지 로드 실패 응답 (유효하지 않은 이미지 종류)",
            content: {
                "application/json":{
                    schema: {
                        type: "object",
                        properties: {
                            "resultType": {type:"string", example:"FAIL"},
                            "error": {
                                type: "object",
                                properties: {
                                    "errorCode": {type:"string", example:"I001"},
                                    "reason": {type:"string", example:"올바른 이미지 종류(타입)을 입력해 주세요."},
                                    "data" :{
                                        type:"object",
                                        properties: {
                                            "type": {type:"string", example:"2"},
                                            "fileName": {type:"string", example:"example.jpeg"}
                                        }
                                    }
                                }
                            },
                            "data": { type: "object", nullable: true, example: null}
                        }
                    }
                }
            }
        }
        #swagger.responses[502] = {
            description: "이미지 로드 실패 응답 (사용할 수 없는 이미지 URL)",
            content: {
                "application/json" :{
                    schema: {
                        type: "object",
                        properties: {
                            "resultType": {type:"string", example:"FAIL"},
                            "error": {
                                type: "object",
                                properties: {
                                    "errorCode": {type:"string", example:"M001"},
                                    "reason": {type:"string", example:"사용할 수 없는 이미지 URL 입니다."},
                                    "data" :{
                                        type:"object",
                                        properties: {
                                            "type": {type:"string", example:"1"},
                                            "fileName": {type:"string", example:"example.jpeg"}
                                        }
                                    }
                                }
                            },
                            "data": { type: "object", nullable: true, example: null}
                        }
                    }
                }
            }
        },
        #swagger.responses[404] = {
            description: "이미지 로드 실패 응답 (존재하지 않는 이미지 - AWS측 응답)",
            content: {
                "application/xml":{
                    schema: {
                        type: "object",
                        xml: {
                            name: "Error"
                        },
                        properties :{
                            "Code" :{ type: "string", example: "NoSuchKey"},
                            "Message": { type: "string", example: "The specified key does not exist."},
                            "Key": {type: "string", example: "crewBanner/example.jpeg"},
                            "RequestId": {type: "string", example: "6FD331TW6AVDP9XP"},
                            "HostId": {type: "string", example: "JCH7JUv3FYD9bzsVy8sY6aO301KO2PwsmvXLCL5hs7FYOTYIQpNAiOyHQG0fgQtN/dLdnGx8+F4="}
                        }
                    }
                }
            }
        }
    */
    // #endregion
    console.log("이미지 로드 작업이 요청되었습니다!")
    console.log("query:", req.query);
    // ✅ 유효성 검사 (파일 타입)
    if (req.query.type === undefined || isNaN(Number(req.query.type)) || Number(req.query.type) < 0 || Number(req.query.type) > 2) {
        throw new InvalidInputValueError("올바른 이미지 종류(타입)을 입력해 주세요.", req.query);
    }
    // 서비스 레이어로부터 Presigned URL 가져오기
    const imageURL = new URL(generatePresignedURL(bodyToGetImageURL(req.query)).url);
    try { // 이 서버를 프록시 서버 역할로 하여 Presigned URL의 이미지를 그대로 클라이언트로 전달하기
        createProxyMiddleware({
            target: imageURL.origin,
            changeOrigin: true,
            pathRewrite: () => `${imageURL.pathname}${imageURL.search}`,
        })(req, res, next);
    } catch (error) { // 접속 불가시 에러 throw 하기
        throw new UnavailableImageError("사용할 수 없는 이미지 URL 입니다.", req.query);
    }
}