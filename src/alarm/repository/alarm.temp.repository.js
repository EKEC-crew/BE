/**
 * @Warning : 이 파일은 임시 파일 입니다. 추후 리펙토링 시 원래 도메인에 맞게 다시 작성해야합니다.
 * 이곳에 포함된 함수는 모두 다른 도메인의 DB를 직접 참조하고 있습니다.
 * 따라서 시현 이후 교체가 필요합니다.
 */

import { prisma } from "../../db.config.js";

export const validateNoticeId = async (noticeId) => {
  const notice = await prisma.crewNotice.findUnique({
    select: {
      id: true,
    },
    where: {
      id: noticeId,
    },
  });
  if (!notice) {
    return false;
  }
  return true;
};

export const validatePostId = async (postId) => {
  const post = await prisma.crewPost.findUnique({
    select: {
      id: true,
    },
    where: {
      id: postId,
    },
  });
  if (!post) {
    return false;
  }
  return true;
};

export const validatePlanId = async (planId) => {
  const plan = await prisma.crewPlan.findUnique({
    select: {
      id: true,
    },
    where: {
      id: planId,
    },
  });
  if (!plan) {
    return false;
  }
  return true;
};
