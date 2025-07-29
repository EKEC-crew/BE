// Prisma 클라이언트 가져오기
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. 공지 리스트 조회
export const getNotices = async (crewId) => {
  try {
    const notices = await prisma.crewNotice.findMany({
      where: {
        crewId: parseInt(crewId, 10),
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        crewMember: {
          select: {
            user: {
              select: {
                nickname: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notices;
  } catch (error) {
    throw new Error("공지사항 목록을 조회하는 중 오류가 발생했습니다.");
  }
};

/**
 * 2. 공지 작성
 * @param {string} crewId - 크루 ID
 * @param {number} userId - 현재 로그인한 사용자의 ID (인증 미들웨어에서 받음)
 * @param {object} noticeData - { title, content } 공지 데이터
 */
export const createNotice = async (crewId, userId, noticeData) => {
  try {
    // 1. 요청을 보낸 사용자가 해당 크루의 맴버인지 확인
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        crewId: parseInt(crewId, 10),
        userId: userId,
      },
    });

    // 2. 크루 맴버가 아니라면 에러 발생
    if (!crewMember) {
      const error = new Error(
        "공지 작성 권한이 없습니다. 크루 멤버인지 확인하세요."
      );
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 3. 공지를 생성하고, 작성자(crewMember) 정보를 연결합니다.
    const newNotice = await prisma.crewNotice.create({
      data: {
        title: noticeData.title,
        content: noticeData.content,
        crew: {
          // crewId를 이용해 Crew와 연결
          connect: {
            id: parseInt(crewId, 10),
          },
        },
        crewMember: {
          // 위에서 찾은 crewMember의 id를 이용해 작성자와 연결
          connect: {
            id: crewMember.id,
          },
        },
      },
    });
    return newNotice;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("공지사항 작성 중 오류가 발생했습니다.");
  }
};

/*
 * 3. 공지 상세 조회
 */
export const getNoticeDetails = async (noticeId) => {
  try {
    const notice = await prisma.crewNotice.findUnique({
      where: {
        id: parseInt(noticeId, 10),
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        modifiedAt: true,
        crewMember: {
          select: {
            user: {
              select: {
                nickname: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!notice) {
      const error = new Error("해당 공지를 찾을 수 없습니다.");
      error.statusCode = 404;
      error.errorCode = "NOTICE_NOT_FOUND";
      throw error;
    }
    return notice;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("공지사항 상세 조회 중 오류가 발생했습니다.");
  }
};

/**
 * 4. 공지 수정
 */
export const updateNotice = async (noticeId, userId, noticeUpdateData) => {
  try {
    // 1. 수정하려는 공지의 작성자 정보를 가져옵니다.
    const notice = await prisma.crewNotice.findUnique({
      where: { id: parseInt(noticeId, 10) },
      select: {
        crewMember: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!notice) {
      const error = new Error("수정할 공지를 찾을 수 없습니다.");
      error.statusCode = 404;
      error.errorCode = "NOTICE_NOT_FOUND";
      throw error;
    }

    // 2. 요청을 보낸 사용자와 공지 작성자가 동일 인물인지 확인합니다.
    if (notice.crewMember.userId !== userId) {
      const error = new Error("공지를 수정할 권한이 없습니다.");
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 3. 데이터를 수정합니다.
    const updatedNotice = await prisma.crewNotice.update({
      where: {
        id: parseInt(noticeId, 10),
      },
      data: {
        title: noticeUpdateData.title,
        content: noticeUpdateData.content,
        modifiedAt: new Date(), // 수정 시각 기록
      },
    });

    return updatedNotice;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("공지사항 수정 중 오류가 발생했습니다.");
  }
};

/*
 * 5. 특정 크루 공지 삭제
 */
export const deleteNotice = async (noticeId, userId) => {
  try {
    // 1. 삭제하려는 공지의 작성자 정보를 가져옴
    const notice = await prisma.crewNotice.findUnique({
      where: { id: parseInt(noticeId, 10) },
      select: {
        crewMember: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!notice) {
      const error = new Error("삭제할 공지를 찾을 수 없습니다.");
      error.statusCode = 404;
      error.errorCode = "NOTICE_NOT_FOUND";
      throw error;
    }

    // 2. 요청을 보낸 사용자와 공지 작성자가 동일 인물인지 확인
    if (notice.crewMember.userId !== userId) {
      const error = new Error("공지를 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 3. 공지 데이터 삭제
    await prisma.crewNotice.delete({
      where: {
        id: parseInt(noticeId, 10),
      },
    });

    return { message: "공지가 성공적으로 삭제되었습니다." };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("공지사항 삭제 중 오류가 발생했습니다.");
  }
};
