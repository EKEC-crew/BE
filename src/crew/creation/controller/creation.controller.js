import { StatusCodes } from "http-status-codes";
import { createNewCrew } from "../service/creation.service.js";
import { bodyToCreateNewCrew } from "../dto/request/creation.request.dto.js";
import { InvalidInputValueError } from "../../../error.js";

/**
 * **[Crew Creation]**
 *  **\<🕹️ Controller\>**
 *  ***handleCreateCrew***
 *  '크루 생성' 기능 담당 API의 컨트롤러
 */
export const handleCreateCrew = async (req, res, next) => {
    // #region 📚 Swagger: 크루 생성
    /*
          #swagger.summary = "크루 생성 (로그인 필요)"
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
                                          },
                                          example: [1,2]
                                      },
                                      styles: {
                                          type: "array",
                                          items:{
                                              type: "number",
                                          },
                                          example:[1,2]
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
          #swagger.responses[400] = {
              description : "크루 생성 실패 응답 (올바르지 않은 입력값)",
              content:{
                  "application/json":{
                      examples:{
                          InvalidCrewInfo :{
                              summary:"올바르지 않은 크루 정보 (JSON 파싱 에러)",
                              value:{
                                  resultType: "FAIL",
                                  error: {
                                      errorCode : "I001",
                                      reason: "올바른 형태의 크루 정보를 입력해주세요. (JSON 파싱 에러)",
                                      data: {
                                          "bannerImage": "",
                                          "crewInfo": "",
                                          "applicationForm": ""
                                      }
                                  },
                                  data:null
                              }
                          },
                          InvalidApplicationForm :{
                              summary: "올바르지 않은 신청서 질문 (JSON 파싱 에러)",
                              value:{
                                  resultType: "FAIL",
                                  error: {
                                      errorCode : "I001",
                                      reason: "올바른 형태의 신청서 질문들을 입력해주세요. (JSON 파싱 에러)",
                                      data: {
                                          "bannerImage": "",
                                          "crewInfo": {
                                              "gender": 0,
                                              "styles": [1,2],
                                              "recruitMessage": "선택해주셔서 감사합니다!",
                                              "name": "새로운 크루",
                                              "activities": [1,2],
                                              "admin": 1,
                                              "region": 1,
                                              "description": "가족같은 분위기의 크루",
                                              "category": 1,
                                              "maxCapacity": 10,
                                              "age": 1
                                          },
                                          "applicationForm": ""
                                      }
                                  },
                                  data:null
                              }
                          },
                          InvalidBannerImage :{
                              summary: "올바르지 않은 배너 이미지",
                              value: {
                                  resultType: "FAIL",
                                  error: {
                                      errorCode : "I001",
                                      reason: "올바른 크루 배너 이미지를 등록 해 주세요.",
                                      data: {
                                          "bannerImage": "",
                                          "crewInfo": {
                                              "gender": 0,
                                              "styles": [1,2],
                                              "recruitMessage": "선택해주셔서 감사합니다!",
                                              "name": "새로운 크루",
                                              "activities": [1,2],
                                              "admin": 1,
                                              "region": 1,
                                              "description": "가족같은 분위기의 크루",
                                              "category": 1,
                                              "maxCapacity": 10,
                                              "age": 1
                                          },
                                          "applicationForm": {
                                              "questions": [
                                                  {
                                                      "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                      "type": 0,
                                                      "choices": ["지인 추천"],
                                                      "etc": 1,
                                                      "required": 1
                                                  }
                                              ]
                                          }
                                      }
                                  },
                                  data:null
                              }
                          },
                          InvalidCrewName: {
                              summary: "올바르지 않은 크루 이름",
                              value: {
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 크루명을 입력해 주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "가족같은 분위기의 크루",
                                          "category": 1,
                                          "maxCapacity": 10,
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": [
                                              {
                                                  "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                  "type": 0,
                                                  "choices": ["지인 추천"],
                                                  "etc": 1,
                                                  "required": 1
                                              }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                              }
                          },
                          InvalidCrewDescription:{
                              summary: "올바르지 않은 크루 소개글",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 크루 소개글을 입력해 주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "",
                                          "category": 1,
                                          "maxCapacity": 10,
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": [
                                              {
                                                  "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                  "type": 0,
                                                  "choices": ["지인 추천"],
                                                  "etc": 1,
                                                  "required": 1
                                              }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                              }
                          },
                          InvalidCrewMaxCapacity:{
                              summary: "올바르지 않은 크루 최대 인원",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 최대 모집 인원을 선택 해 주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "가족같은 분위기의 크루",
                                          "category": 1,
                                          "maxCapacity": "a",
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": [
                                              {
                                                  "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                  "type": 0,
                                                  "choices": ["지인 추천"],
                                                  "etc": 1,
                                                  "required": 1
                                              }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                                  }
                          },
                          InvalidCrewCategory:{
                              summary: "올바르지 않은 크루 카테고리",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 카테고리를 선택 해 주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "가족같은 분위기의 크루",
                                          "category": "a",
                                          "maxCapacity": 10,
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": [
                                              {
                                                  "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                  "type": 0,
                                                  "choices": ["지인 추천"],
                                                  "etc": 1,
                                                  "required": 1
                                              }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                                  }
                          },
                          InvalidCrewActivities:{
                              summary: "올바르지 않은 크루 활동",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 활동을 선택해주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": ["a"],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "가족같은 분위기의 크루",
                                          "category": 1,
                                          "maxCapacity": 10,
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": [
                                              {
                                                  "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                  "type": 0,
                                                  "choices": ["지인 추천"],
                                                  "etc": 1,
                                                  "required": 1
                                              }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                                  }
                          },
                          InvalidCrewStyles:{
                              summary: "올바르지 않은 크루 스타일",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 스타일을 선택해주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": ["a"],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "가족같은 분위기의 크루",
                                          "category": 1,
                                          "maxCapacity": 10,
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": [
                                              {
                                                  "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                  "type": 0,
                                                  "choices": ["지인 추천"],
                                                  "etc": 1,
                                                  "required": 1
                                              }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                                  }
                          },
                          InvalidCrewRegion:{
                              summary: "올바르지 않은 크루 지역",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 지역을 선택해주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": "a",
                                          "description": "가족같은 분위기의 크루",
                                          "category": 1,
                                          "maxCapacity": 10,
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": [
                                              {
                                                  "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                  "type": 0,
                                                  "choices": ["지인 추천"],
                                                  "etc": 1,
                                                  "required": 1
                                              }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                                  }
                          },
                          InvalidCrewAge:{
                              summary: "올바르지 않은 크루 연령대",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 연령대를 선택해주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "가족같은 분위기의 크루",
                                          "category": 1,
                                          "maxCapacity": 10,
                                          "age": "a"
                                      },
                                      "applicationForm": {
                                          "questions": [
                                              {
                                                  "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                  "type": 0,
                                                  "choices": ["지인 추천"],
                                                  "etc": 1,
                                                  "required": 1
                                              }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                                  }
                          },
                          InvalidCrewGender:{
                              summary: "올바르지 않은 크루 성별",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 성별을 선택해주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": "a",
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "가족같은 분위기의 크루",
                                          "category": 1,
                                          "maxCapacity": 10,
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": [
                                              {
                                                  "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                                  "type": 0,
                                                  "choices": ["지인 추천"],
                                                  "etc": 1,
                                                  "required": 1
                                              }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                                  }
                          },
                          InvalidCrewApplicationForm:{
                              summary: "올바르지 않은 크루 신청서 - 신청서가 입력되지 않음",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "최소 한개이상의 질문을 입력해 주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "가족같은 분위기의 크루",
                                          "category": 1,
                                          "maxCapacity": 10,
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": []
                                      }
                                      }
                                  },
                                  "data": null
                                  }
                          },
                          InvalidCrewApplicationFormDetails:{
                              summary: "올바르지 않은 크루 신청서 - 질문 형식 오류",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I001",
                                      "reason": "올바른 형식에 맞춰 질문을 작성 해 주세요.",
                                      "data": {
                                      "crewInfo": {
                                          "gender": 0,
                                          "styles": [1,2],
                                          "recruitMessage": "선택해주셔서 감사합니다!",
                                          "name": "새로운 크루",
                                          "activities": [1,2],
                                          "admin": 1,
                                          "region": 1,
                                          "description": "가족같은 분위기의 크루",
                                          "category": 1,
                                          "maxCapacity": 10,
                                          "age": 1
                                      },
                                      "applicationForm": {
                                          "questions": [
                                          {
                                              "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                              "type": 0,
                                              "choices": [1],
                                              "etc": 1,
                                              "required": 1
                                          }
                                          ]
                                      }
                                      }
                                  },
                                  "data": null
                              }
                          }
                      }
                  }
              }
          }
          #swagger.responses[422] = {
              description : "크루 생성 실패 응답 (유효하지 않은 입력값)",
              content:{
                  "application/json":{
                      examples:{
                          UnprocessableCrewCategory :{
                              summary: "유효하지 않는 카테고리",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I002",
                                      "reason": "유효하지 않은 카테고리 입니다.",
                                      "data": {
                                      "name": "새로운 크루",
                                      "description": "가족같은 분위기의 크루",
                                      "maxCapacity": 10,
                                      "category": 100,
                                      "activities": [1,2],
                                      "styles": [1,2],
                                      "region": 1,
                                      "age": 1,
                                      "gender": 0,
                                      "recruitMessage": "선택해주셔서 감사합니다!",
                                      "applicationForm": [
                                          {
                                          "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                          "type": 0,
                                          "choices": ["지인 추천"],
                                          "etc": 1,
                                          "required": 1
                                          }
                                      ],
                                      "admin": 1
                                      }
                                  },
                                  "data": null
                              }
                          },
                          UnprocessableCrewActivities :{
                              summary: "유효하지 않은 활동",
                              value: {
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I002",
                                      "reason": "유효하지 않은 활동 분류 입니다.",
                                      "data": {
                                      "name": "새로운 크루",
                                      "description": "가족같은 분위기의 크루",
                                      "maxCapacity": 10,
                                      "category": 1,
                                      "activities": [99,100],
                                      "styles": [1,2],
                                      "region": 1,
                                      "age": 1,
                                      "gender": 0,
                                      "recruitMessage": "선택해주셔서 감사합니다!",
                                      "applicationForm": [
                                          {
                                          "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                          "type": 0,
                                          "choices": ["지인 추천"],
                                          "etc": 1,
                                          "required": 1
                                          }
                                      ],
                                      "admin": 1
                                      }
                                  },
                                  "data": null
                              }
                          },
                          UnprocessableCrewStyles :{
                              summary: "유효하지 않은 스타일",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I002",
                                      "reason": "유효하지 않은 스타일 분류 입니다.",
                                      "data": {
                                      "name": "새로운 크루",
                                      "description": "가족같은 분위기의 크루",
                                      "maxCapacity": 10,
                                      "category": 1,
                                      "activities": [1,2],
                                      "styles": [99,100],
                                      "region": 1,
                                      "age": 1,
                                      "gender": 0,
                                      "recruitMessage": "선택해주셔서 감사합니다!",
                                      "applicationForm": [
                                          {
                                          "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                          "type": 0,
                                          "choices": ["지인 추천"],
                                          "etc": 1,
                                          "required": 1
                                          }
                                      ],
                                      "admin": 1
                                      }
                                  },
                                  "data": null
                              }
                          },
                          UnprocessableCrewRegion :{
                              summary: "유효하지 않은 지역",
                              value:{
                                  "resultType": "FAIL",
                                  "error": {
                                      "errorCode": "I002",
                                      "reason": "유효하지 않은 지역 입니다.",
                                      "data": {
                                      "name": "새로운 크루",
                                      "description": "가족같은 분위기의 크루",
                                      "maxCapacity": 10,
                                      "category": 1,
                                      "activities": [1,2],
                                      "styles": [1,2],
                                      "region": 100000,
                                      "age": 1,
                                      "gender": 0,
                                      "recruitMessage": "선택해주셔서 감사합니다!",
                                      "applicationForm": [
                                          {
                                          "question": "어떤경로로 이 크루를 가입하시게 되셨나요?",
                                          "type": 0,
                                          "choices": ["지인 추천"],
                                          "etc": 1,
                                          "required": 1
                                          }
                                      ],
                                      "admin": 1
                                      }
                                  },
                                  "data": null
                              }
                          }
                      }
                  }
              }
          }
       */
    // #endregion
    // multipart/form-data 로부터 JSON 파싱
    // ✅ 유효성 검사 (크루정보, 크루 신청서)
    try {
        req.body.crewInfo = JSON.parse(req.body.crewInfo);
    } catch (error) {
        throw new InvalidInputValueError(
            "올바른 형태의 크루 정보를 입력해주세요. (JSON 파싱 에러)",
            req.body,
        );
    }
    try {
        req.body.applicationForm = JSON.parse(req.body.applicationForm);
    } catch (error) {
        throw new InvalidInputValueError(
            "올바른 형태의 신청서 질문들을 입력해주세요. (JSON 파싱 에러)",
            req.body,
        );
    }
    console.log("크루 생성이 요청되었습니다!");
    console.log("body:", req.body);

    // ✅ 유효성 검사 (배너 이미지)
    const validImageExtensions = ["jpg", "jpeg", "png", "gif"];
    if (
        req.file === undefined ||
        validImageExtensions.every(
            (extension) => req.file.originalname.split(".").at(-1) !== extension,
        )
    ) {
        throw new InvalidInputValueError(
            "올바른 크루 배너 이미지를 등록 해 주세요.",
            req.body,
        );
    }
    // ✅ 유효성 검사 (크루 명)
    if (
        req.body.crewInfo.name === undefined ||
        req.body.crewInfo.name === "" ||
        typeof req.body.crewInfo.name !== "string"
    ) {
        throw new InvalidInputValueError(
            "올바른 크루명을 입력해 주세요.",
            req.body,
        );
    }
    // ✅ 유효성 검사 (크루 소개글)
    if (
        req.body.crewInfo.description === undefined ||
        req.body.crewInfo.description === "" ||
        typeof req.body.crewInfo.description !== "string"
    ) {
        throw new InvalidInputValueError(
            "올바른 크루 소개글을 입력해 주세요.",
            req.body,
        );
    }
    // ✅ 유효성 검사 (최대 모집 인원)
    if (
        req.body.crewInfo.maxCapacity === undefined ||
        typeof req.body.crewInfo.maxCapacity !== "number"
    ) {
        throw new InvalidInputValueError(
            "올바른 최대 모집 인원을 선택 해 주세요.",
            req.body,
        );
    }
    // ✅ 유효성 검사 (카테고리)
    if (
        req.body.crewInfo.category === undefined ||
        typeof req.body.crewInfo.category !== "number"
    ) {
        throw new InvalidInputValueError(
            "올바른 카테고리를 선택 해 주세요.",
            req.body,
        );
    }
    // ✅ 유효성 검사 (활동/액티비티)
    if (
        req.body.crewInfo.activities === undefined ||
        req.body.crewInfo.activities.length < 2 ||
        req.body.crewInfo.activities.length > 5 ||
        !req.body.crewInfo.activities.every(
            (activity) => typeof activity === "number",
        )
    ) {
        throw new InvalidInputValueError("올바른 활동을 선택해주세요.", req.body);
    }
    // ✅ 유효성 검사 (스타일)
    if (
        req.body.crewInfo.styles === undefined ||
        req.body.crewInfo.styles.length < 2 ||
        req.body.crewInfo.styles.length > 5 ||
        !req.body.crewInfo.styles.every((style) => typeof style === "number")
    ) {
        throw new InvalidInputValueError("올바른 스타일을 선택해주세요.", req.body);
    }
    // ✅ 유효성 검사 (지역)
    if (
        req.body.crewInfo.region === undefined ||
        typeof req.body.crewInfo.region !== "number"
    ) {
        throw new InvalidInputValueError("올바른 지역을 선택해주세요.", req.body);
    }
    // ✅ 유효성 검사 (연령대)
    if (
        req.body.crewInfo.age === undefined ||
        typeof req.body.crewInfo.age !== "number" ||
        req.body.crewInfo.age < 0 ||
        req.body.crewInfo.age > 8
    ) {
        throw new InvalidInputValueError("올바른 연령대를 선택해주세요.", req.body);
    }
    // ✅ 유효성 검사 (성별)
    if (
        req.body.crewInfo.gender === undefined ||
        typeof req.body.crewInfo.gender !== "number" ||
        req.body.crewInfo.gender > 2 ||
        req.body.crewInfo.gender < 0
    ) {
        throw new InvalidInputValueError("올바른 성별을 선택해주세요.", req.body);
    }
    // ✅ 유효성 검사 (지원서 질문)
    if (req.body.applicationForm.questions.length === 0) {
        throw new InvalidInputValueError(
            "최소 한개이상의 질문을 입력해 주세요.",
            req.body,
        );
    }
    // ✅ 유효성 검사 (지원서 질문 세부 내용)
    const isQuestionsValid = req.body.applicationForm.questions.every((q) => {
        // 질문 내용 유효성 검사
        if (q.question === undefined || q.question === "") return false;
        // 질문 타입 유효성 검사
        if (
            q.type === undefined ||
            typeof q.type !== "number" ||
            q.type < 0 ||
            q.type > 1
        )
            return false;
        // 질문 타입이 체크박스 형인 경우
        if (q.type === 0) {
            // 선택지 유효성 검사
            if (q.choices === undefined || q.choices.length === 0) return false;
            // 모든 선택지의 유효성(타입) 검사
            if (!q.choices.every((choice) => typeof choice === "string"))
                return false;
        }
        // 기타 항목 표시에 대한 유효성 검사
        if (
            q.etc === undefined ||
            typeof q.etc !== "number" ||
            q.etc < 0 ||
            q.etc > 1
        )
            return false;
        // 필수 사항 여부에 대한 유효성 검사
        if (
            q.required === undefined ||
            typeof q.required !== "number" ||
            q.required < 0 ||
            q.required > 1
        )
            return false;
        return true;
    });
    if (!isQuestionsValid) {
        throw new InvalidInputValueError(
            "올바른 형식에 맞춰 질문을 작성 해 주세요.",
            req.body,
        );
    }
    // DTO를 거쳐 서비스 레이어로 새로운 크루 생성 요청
    const crew = await createNewCrew(bodyToCreateNewCrew(req.body, req.file));
    // 결과값 클라이언트로 응답
    res.status(StatusCodes.CREATED).success(crew);
};
