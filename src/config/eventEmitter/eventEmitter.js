import EventEmitter from "events";
import {
  onCrewJoinRequest,
  onCrewJoinAccepted,
  onCrewJoinRejected,
  onError,
  onNoticeCreated,
  onScheduleCreated,
  onPostLiked,
  onPostCommented,
  onCrewWarned,
  onCrewKicked,
} from "../../alarm/service/listener/alarm.listener.js";
const initEventEmitter = () => {
  const eventEmitter = new EventEmitter();
  eventEmitter.on("CREW_JOIN_REQUEST", onCrewJoinRequest);
  eventEmitter.on("CREW_JOIN_ACCEPTED", onCrewJoinAccepted);
  eventEmitter.on("CREW_JOIN_REJECTED", onCrewJoinRejected);
  eventEmitter.on("NOTICE_CREATED", onNoticeCreated);
  eventEmitter.on("SCHEDULE_CREATED", onScheduleCreated);
  eventEmitter.on("POST_LIKED", onPostLiked);
  eventEmitter.on("POST_COMMENTED", onPostCommented);
  eventEmitter.on("CREW_WARNED", onCrewWarned);
  eventEmitter.on("CREW_KICKED", onCrewKicked);
  eventEmitter.on("ERROR", onError);
  return eventEmitter;
};

export default initEventEmitter;
