import { sendAlarm } from "../alarm.service.js";
export const onCrewJoinRequest = (data) => {
  sendAlarm(data.targetId, "CREW_JOIN_REQUEST", data.userId);
};
export const onCrewJoinAccepted = (data) => {
  sendAlarm(data.targetId, "CREW_JOIN_ACCEPTED", data.userId);
};
export const onCrewJoinRejected = (data) => {
  sendAlarm(data.targetId, "CREW_JOIN_REJECTED", data.userId);
};
export const onNoticeCreated = (data) => {
  sendAlarm(data.targetId, "NOTICE_CREATED", data.userId);
};
export const onScheduleCreated = (data) => {
  sendAlarm(data.targetId, "SCHEDULE_CREATED", data.userId);
};
export const onPostLiked = (data) => {
  sendAlarm(data.targetId, "POST_LIKED", data.userId);
};
export const onPostCommented = (data) => {
  sendAlarm(data.targetId, "POST_COMMENTED", data.userId);
};
export const onCrewWarned = (data) => {
  sendAlarm(data.targetId, "CREW_WARNED", data.userId);
};
export const onCrewKicked = (data) => {
  sendAlarm(data.targetId, "CREW_KICKED", data.userId);
};
export const onError = (error) => {
  console.error(`알림 생성 오류 : `, error);
};
