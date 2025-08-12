import EventEmitter from "events";
import {
  onCrewJoinRequest,
  onError,
} from "../../alarm/service/listener/alarm.listener.js";
const initEventEmitter = () => {
  const eventEmitter = new EventEmitter();
  eventEmitter.on("CREW_JOIN_REQUEST", onCrewJoinRequest);
  eventEmitter.on("ERROR", onError);
  return eventEmitter;
};

export default initEventEmitter;
