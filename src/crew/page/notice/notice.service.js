// Prisma 클라이언트 가져오기
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. 공지 리스트 조회
export const getNotices = async (crewId, userId = null) => {
  try {
    const notices = await prisma.crewNotice.findMany({
      where: {
        crewId: parseInt(crewId, 10),
      },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        crewMember: {
          select: {
            id: true,
            role: true, // 작성자의 역할 추가
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

    // 공지 데이터에 author 정보 추가
    const noticesWithAuthor = notices.map((notice) => ({
      ...notice,
      author: {
        crewMemberId: notice.crewMember.id,
        role: notice.crewMember.role,
        nickname: notice.crewMember.user.nickname,
      },
    }));

    // 사용자가 로그인한 경우 좋아요 상태 확인
    if (userId) {
      const noticesWithLikes = await Promise.all(
        noticesWithAuthor.map(async (notice) => {
          const like = await prisma.crewNoticeLike.findFirst({
            where: {
              crewNoticeId: notice.id,
              crewMember: {
                userId: userId,
              },
            },
          });
          return {
            ...notice,
            isLiked: !!like,
          };
        })
      );
      return noticesWithLikes;
    }

    return noticesWithAuthor;
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
    // 1. 요청을 보낸 사용자가 해당 크루의 맴버인지 확인하고 역할도 함께 조회
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        crewId: parseInt(crewId, 10),
        userId: userId,
      },
      select: {
        id: true,
        role: true,
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

    // 3. 크루장(2) 또는 운영진(1)만 공지 작성 가능
    if (crewMember.role !== 2 && crewMember.role !== 1) {
      const error = new Error(
        "공지 작성 권한이 없습니다. 크루장 또는 운영진만 공지를 작성할 수 있습니다."
      );
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 4. 공지를 생성하고, 작성자(crewMember) 정보를 연결합니다.
    const newNotice = await prisma.crewNotice.create({
      data: {
        title: noticeData.title,
        content: noticeData.content,
        type: noticeData.type,
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
export const getNoticeDetails = async (noticeId, userId = null) => {
  try {
    const notice = await prisma.crewNotice.findUnique({
      where: {
        id: parseInt(noticeId, 10),
      },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        createdAt: true,
        modifiedAt: true,
        crewMember: {
          select: {
            id: true, // crewMemberId 추가
            role: true, // 작성자의 역할 추가
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

    // 사용자가 로그인한 경우 좋아요 상태 확인
    if (userId) {
      const like = await prisma.crewNoticeLike.findFirst({
        where: {
          crewNoticeId: notice.id,
          crewMember: {
            userId: userId,
          },
        },
      });
      notice.isLiked = !!like;
    }

    // author 정보 추가
    console.log("crewMember data:", notice.crewMember); // 디버깅용 로그
    notice.author = {
      crewMemberId: notice.crewMember.id,
      role: notice.crewMember.role,
      nickname: notice.crewMember.user.nickname,
      image: notice.crewMember.user.image,
    };
    console.log("author object:", notice.author); // 디버깅용 로그

    // 좋아요 관련 정보 조회
    const likes = await prisma.crewNoticeLike.findMany({
      where: {
        crewNoticeId: notice.id,
      },
      include: {
        crewMember: {
          select: {
            id: true,
            user: {
              select: {
                nickname: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 좋아요 정보 추가
    notice.totalLikes = likes.length;
    notice.likedBy = likes.map((like) => ({
      crewMemberId: like.crewMember.id,
      nickname: like.crewMember.user.nickname,
      likedAt: like.createdAt,
    }));

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
    // 1. 수정하려는 공지의 작성자 정보와 크루 정보를 가져옵니다.
    const notice = await prisma.crewNotice.findUnique({
      where: { id: parseInt(noticeId, 10) },
      select: {
        crewId: true,
        crewMember: {
          select: {
            userId: true,
            role: true,
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

    // 2. 요청을 보낸 사용자가 해당 크루의 멤버인지 확인하고 역할도 함께 조회
    const currentUser = await prisma.crewMember.findFirst({
      where: {
        crewId: notice.crewId,
        userId: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!currentUser) {
      const error = new Error("공지를 수정할 권한이 없습니다.");
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 3. 공지 작성자이거나 크루장(2) 또는 운영진(1)인 경우에만 수정 가능
    const isAuthor = notice.crewMember.userId === userId;
    const isAdmin = currentUser.role === 2 || currentUser.role === 1;

    if (!isAuthor && !isAdmin) {
      const error = new Error("공지를 수정할 권한이 없습니다.");
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 4. 데이터를 수정합니다.
    const updatedNotice = await prisma.crewNotice.update({
      where: {
        id: parseInt(noticeId, 10),
      },
      data: {
        title: noticeUpdateData.title,
        content: noticeUpdateData.content,
        type: noticeUpdateData.type,
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
    // 1. 삭제하려는 공지의 작성자 정보와 크루 정보를 가져옴
    const notice = await prisma.crewNotice.findUnique({
      where: { id: parseInt(noticeId, 10) },
      select: {
        crewId: true,
        crewMember: {
          select: {
            userId: true,
            role: true,
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

    // 2. 요청을 보낸 사용자가 해당 크루의 멤버인지 확인하고 역할도 함께 조회
    const currentUser = await prisma.crewMember.findFirst({
      where: {
        crewId: notice.crewId,
        userId: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!currentUser) {
      const error = new Error("공지를 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 3. 공지 작성자이거나 크루장(2) 또는 운영진(1)인 경우에만 삭제 가능
    const isAuthor = notice.crewMember.userId === userId;
    const isAdmin = currentUser.role === 2 || currentUser.role === 1;

    if (!isAuthor && !isAdmin) {
      const error = new Error("공지를 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 4. 공지 데이터 삭제
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

/**
 * 6. 공지사항 좋아요 토글
 * @param {number} noticeId - 공지 ID
 * @param {number} userId - 사용자 ID
 * @returns {Object} 좋아요 토글 결과
 */
export const toggleNoticeLike = async (noticeId, userId) => {
  try {
    // 1. 공지사항 존재 여부 확인
    const notice = await prisma.crewNotice.findUnique({
      where: { id: parseInt(noticeId, 10) },
      include: {
        crewNoticeLike: {
          include: {
            crewMember: {
              select: {
                id: true,
                userId: true,
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

    // 2. 사용자가 해당 크루의 멤버인지 확인
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        userId: userId,
        crewId: notice.crewId,
      },
    });

    if (!crewMember) {
      const error = new Error("크루 멤버만 좋아요를 누를 수 있습니다.");
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 3. 현재 사용자가 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.crewNoticeLike.findFirst({
      where: {
        crewNoticeId: parseInt(noticeId, 10),
        crewMemberId: crewMember.id,
      },
    });

    let isLiked, action, likedBy;

    if (existingLike) {
      // 4. 좋아요가 있으면 제거
      await prisma.crewNoticeLike.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
      action = "removed";
    } else {
      // 5. 좋아요가 없으면 추가
      await prisma.crewNoticeLike.create({
        data: {
          crewNoticeId: parseInt(noticeId, 10),
          crewMemberId: crewMember.id,
        },
      });
      isLiked = true;
      action = "added";
    }

    // 6. 업데이트된 좋아요 정보 조회
    const updatedLikes = await prisma.crewNoticeLike.findMany({
      where: {
        crewNoticeId: parseInt(noticeId, 10),
      },
      include: {
        crewMember: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    likedBy = updatedLikes.map((like) => ({
      crewMemberId: like.crewMember.id,
      createdAt: like.createdAt,
    }));

    return {
      isLiked,
      totalLikes: updatedLikes.length,
      action,
      likedBy,
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("좋아요 토글 중 오류가 발생했습니다.");
  }
};
