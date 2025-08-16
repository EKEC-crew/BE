import { HttpStatusCode } from "axios";
import {
  bodyToGetAlarms,
  bodyToReadAlarm,
} from "../dto/request/alarm.request.dto.js";
import { getAlarms, readAlarm } from "../service/alarm.service.js";
/**
 * **[Alarm]**
 *  **\<🕹️ Controller\>**
 *  ***handleGetAlarms***
 *  '알림 목록 조회' 기능 담당 API의 컨트롤러
 */
export const handleGetAlarms = async (req, res, next) => {
  /*
    #swagger.tags = ['Alarm']
    #swagger.summary = '특정 유저 알림 리스트 조회'
    #swagger.description = '알림 목록을 조회합니다.'
    #swagger.parameters['page'] = {
      description: '페이지 번호',
      required: true,
      type: 'number',
      example: 1
    }
    #swagger.responses[200] = {
      description: '특정 유저 알림 리스트 조회 성공',
      content:{
        "application/json":{
          schema: {
            type: 'object',
            properties: {
              resultType: {type:"string", example:"SUCCESS"},
              error:{type:"object", nullable:true, example:null},
              data:{
                type:"object",
                properties:{
                  alarms: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string', example:"CREW_JOIN_REQUEST" },
                        createdAt: { type: 'string', example: "2025-08-11T15:56:32.133Z" },
                        noticeId: { type: 'number', example: 1 },
                        postId: { type: 'number', example: 1 },
                        planId: { type: 'number', example: 1},
                        user:{
                          type:"object",
                          properties:{
                            id:{type:"number",example:1},
                            nickname:{type:"string",example:"길동이"},
                            name:{type:"string",example:"홍길동"}
                          }
                        },
                        crew:{
                          type:"object",
                          properties:{
                            id:{type:"number",example:1},
                            name:{type:"string",example:"하이킹 크루"},
                          }
                        }
                      }
                    }
                  },
                  count: { type: 'number', example: 1 }
                }
              }
            }
          }
        }
      }
    }
  */
  console.log("알림 목록이 요청되었습니다!");
  console.log("payload:", req.payload);

  const alarms = await getAlarms(bodyToGetAlarms(req.payload, req.query));
  res.status(HttpStatusCode.Ok).success(alarms);
};
/**
 * **[Alarm]**
 *  **\<🕹️ Controller\>**
 *  ***handleReadAlarm***
 *  '알림 읽음 처리' 기능 담당 API의 컨트롤러
 */
export const handleReadAlarm = async (req, res, next) => {
  /*
    #swagger.summary = "특정 유저 특정 알림 조회(알림 읽음 처리)"
    #swagger.tags = ["Alarm"]
    #swagger.description = "특정 유저의 특정 알림을 조회합니다."
    #swagger.parameters['alarmId'] = {
      in: 'path',
      description: '알림 ID',
      required: true,
      type: 'number',
      example: 1
    }
    #swagger.responses[404] = {
      description: "알림 읽음 처리 실패(존재하지 않는 알림)",
      content:{
        'application/json':{
          schema:{
            type:'object',
            properties:{
              resultType:{type:'string',example:'FAIL'},
              error:{
                type:'object',
                properties:{
                  errorCode:{type:'string',example:"A001"},
                  reason:{type:'string',example:'존재하지 않는 알림입니다.'},
                  data:{
                    type:'object',
                    properties:{
                      userId:{type:'number',example:1},
                      alarmId:{type:'number',example:1},
                    }
                  }
                }
              },
              data:{type:'object',nullable:true,example:null}
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '알림 읽음 처리 성공',
      content:{
        'application/json':{
          schema:{
            type:'object',
            properties:{
              resultType:{type:'string',example:'SUCCESS'},
              error:{type:'object',nullable:true,example:null},
              data:{
                type:"object",
                properties:{
                  id:{type:"number",example:1},
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  console.log("알림 읽음 처리가 요청되었습니다!");
  console.log("payload:", req.payload);

  const alarm = await readAlarm(bodyToReadAlarm(req.payload, req.params));

  res.status(HttpStatusCode.Ok).success(alarm);
};
