import { prisma } from "../../db.config.js";
/**
 * **[Alarm]**
 * **\<📦 Repository\>**
 * ***findUnreadAlarms***
 * DB로부터 유저가 읽지 않은 알림을 가져옵니다.
 * @param {object} data
 * @returns {object}
 */
export const findUnreadAlarms = async (data) => {
  const alarms = await prisma.receivedAlarm.findMany({
    select: {
      id: true,
      alarm: {
        select: {
          type: true,
          createdAt: true,
          userId: true,
          crewId: true,
          noticeId: true,
          postId: true,
          planId: true,
          user: {
            select: {
              id: true,
              nickname: true,
              name: true,
            },
          },
          crew: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    where: {
      status: 0,
      userId: data.userId,
    },
    orderBy: {
      alarm: {
        createdAt: "desc",
      },
    },
    skip: (data.page - 1) * 10,
    take: 10,
  });
  const count = await prisma.receivedAlarm.count({
    where: {
      status: 0,
      userId: data.userId,
    },
  });
  return { alarms, count };
};
/**
 * **[Alarm]**
 * **\<📦 Repository\>**
 * ***createAlarm***
 * 새로운 알림을 DB에 생성합니다.
 * @param {object} data
 * @returns {number}
 */
export const createAlarm = async (data) => {
  const alarm = await prisma.alarm.create({
    data: {
      type: data.type,
      userId: data.targetId.userId,
      crewId: data.targetId.crewId,
      noticeId: data.targetId.noticeId || null,
      postId: data.targetId.postId || null,
      planId: data.targetId.planId || null,
    },
  });
  const userAlarms = data.userId.map((id) => {
    return {
      alarmId: alarm.id,
      userId: id,
    };
  });
  await prisma.receivedAlarm.createMany({
    data: userAlarms,
  });
  return alarm.id;
};
/**
 * **[Alarm]**
 * **\<📦 Repository\>**
 * ***changeAlarmStatus***
 * 알림의 상태를 읽었음으로 변경합니다.
 * @param {object} data
 * @returns {number}
 */
export const changeAlarmStatus = async (data) => {
  const isExist = await prisma.receivedAlarm.findFirst({
    select: {
      id: true,
    },
    where: {
      id: data.alarmId,
      userId: data.userId,
    },
  });
  if (!isExist) return -1;
  const alarm = await prisma.receivedAlarm.update({
    where: {
      id: data.alarmId,
      userId: data.userId,
    },
    data: {
      status: 1,
    },
  });
  const alarmId = (
    await prisma.receivedAlarm.findFirst({
      select: {
        alarmId: true,
      },
      where: {
        id: data.alarmId,
      },
    })
  ).alarmId;
  const sameAlarmsCount = await prisma.receivedAlarm.count({
    where: {
      alarmId: alarmId,
      status: 0,
    },
  });
  if (sameAlarmsCount == 0) {
    await prisma.alarm.update({
      where: {
        id: alarmId,
      },
      data: {
        status: 1,
      },
    });
  }
  return alarm.id;
};
