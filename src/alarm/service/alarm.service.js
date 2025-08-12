import { validateUserIsExist } from "../../auth/service/auth.service.js";
import {
  AlarmNotFoundError,
  InvalidInputValueError,
  UserNotFoundError,
} from "../../error.js";
import { eventEmitter } from "../../index.js";
import {
  responseFromGetAlarms,
  responseFromReadAlarm,
} from "../dto/response/alarm.response.dto.js";
import {
  changeAlarmStatus,
  createAlarm,
  findUnreadAlarms,
} from "../repository/alarm.repository.js";
import {
  validateNoticeId,
  validatePlanId,
  validatePostId,
} from "../repository/alarm.temp.repository.js";

const requiredTarget = {
  CREW_JOIN_REQUEST: ["userId", "crewId"],
  CREW_JOIN_ACCEPTED: ["userId", "crewId"],
  CREW_JOIN_REJECTED: ["userId", "crewId"],
  NOTICE_CREATED: ["crewId", "noticeId"],
  SCHEDULE_CREATED: ["crewId", "planId"],
  POST_LIKED: ["userId", "postId"],
  POST_COMMENTED: ["userId", "postId"],
  CREW_WARNED: ["crewId"],
  CREW_KICKED: ["crewId"],
};
/**
 * **[Alarm]**
 * **\<🛠️ Service\>**
 * ***formatAlarm***
 * 알림의 형식을 정형화하기 위한 함수 입니다.
 */
const formatAlarm = (alarms) => {
  return alarms.map((alarm) => {
    return {
      id: alarm.id,
      type: alarm.alarm.type,
      createdAt: alarm.alarm.createdAt,
      noticeId: alarm.alarm.noticeId,
      postId: alarm.alarm.postId,
      planId: alarm.alarm.planId,
      user: {
        id: alarm.alarm.userId,
        nickname: alarm.alarm.user.nickname,
        name: alarm.alarm.user.name,
      },
      crew: {
        id: alarm.alarm.crewId,
        name: alarm.alarm.crew.title,
      },
    };
  });
};
/**
 * **[Alarm]**
 * **\<🛠️ Service\>**
 * ***sendAlarm***
 * 알림을 보내기 위한 함수 입니다.
 */
export const sendAlarm = async (targetId, type, userId) => {
  if (
    !requiredTarget[type].every((target) => Object.hasOwn(targetId, target))
  ) {
    return eventEmitter.emit(
      "ERROR",
      new InvalidInputValueError("올바르지 않은 입력값입니다."),
    );
  }
  const promises = userId.map((id) => validateUserIsExist(id));
  const result = await Promise.all(promises);
  if (!result.every((res) => res)) {
    return eventEmitter.emit(
      "ERROR",
      new UserNotFoundError("존재하지 않는 유저 입니다.(userId)"),
    );
  }
  if (
    Object.hasOwn(targetId, "userId") &&
    !(await validateUserIsExist(targetId.userId))
  ) {
    return eventEmitter.emit(
      "ERROR",
      new UserNotFoundError("존재하지 않는 유저 입니다.(targetId.userId)"),
    );
  }
  if (Object.hasOwn(targetId, "userId") && targetId.userId == userId) {
    return eventEmitter.emit(
      "ERROR",
      new InvalidInputValueError("올바르지 않은 입력값입니다."),
    );
  }
  if (
    Object.hasOwn(targetId, "noticeId") &&
    !(await validateNoticeId(targetId.noticeId))
  ) {
    return eventEmitter.emit(
      "ERROR",
      new InvalidInputValueError("올바르지 않은 입력값입니다. (noticeId)"),
    );
  }
  if (
    Object.hasOwn(targetId, "postId") &&
    !(await validatePostId(targetId.postId))
  ) {
    return eventEmitter.emit(
      "ERROR",
      new InvalidInputValueError("올바르지 않은 입력값입니다. (postId)"),
    );
  }
  if (
    Object.hasOwn(targetId, "planId") &&
    !(await validatePlanId(targetId.planId))
  ) {
    return eventEmitter.emit(
      "ERROR",
      new InvalidInputValueError("올바르지 않은 입력값입니다. (planId)"),
    );
  }
  await createAlarm({
    targetId,
    type,
    userId,
  });
};
/**
 * **[Alarm]**
 * **\<🛠️ Service\>**
 * ***getAlarms***
 * 알림을 가져오기 위한 함수 입니다.
 */
export const getAlarms = async (data) => {
  let { alarms, count } = await findUnreadAlarms(data);
  alarms = alarms ? formatAlarm(alarms) : [];
  return responseFromGetAlarms({ alarms, count });
};
/**
 * **[Alarm]**
 * **\<🛠️ Service\>**
 * ***readAlarm***
 * 알림을 읽음 처리 하기 위한 함수입니다.
 */
export const readAlarm = async (data) => {
  const alarmId = await changeAlarmStatus(data);
  if (alarmId === -1) {
    throw new AlarmNotFoundError("존재하지 않는 알림입니다.", data);
  }
  return responseFromReadAlarm({ alarmId });
};
