// Prisma 클라이언트 가져오기
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. 공지 좋아요
export const likeNotice = async (crewId, noticeId, userId) => {
  try {
    // 1. 요청을 보낸 사용자가 해당 크루의 맴버인지 확인
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        crewId: parseInt(crewId, 10),
        userId: userId,
      },
    });

    if (!crewMember) {
      const error = new Error(
        "좋아요 권한이 없습니다. 크루 멤버인지 확인하세요."
      );
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 2. 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.crewNoticeLike.findFirst({
      where: {
        crewNoticeId: parseInt(noticeId, 10),
        crewMemberId: crewMember.id,
      },
    });

    if (existingLike) {
      const error = new Error("이미 좋아요를 눌렀습니다.");
      error.statusCode = 400;
      error.errorCode = "ALREADY_LIKED";
      throw error;
    }

    // 3. 좋아요 추가
    await prisma.crewNoticeLike.create({
      data: {
        crewNotice: {
          connect: {
            id: parseInt(noticeId, 10),
          },
        },
        crewMember: {
          connect: {
            id: crewMember.id,
          },
        },
      },
    });

    return { message: "좋아요가 추가되었습니다." };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("좋아요 처리 중 오류가 발생했습니다.");
  }
};

// 1-1. 공지 좋아요 취소
export const unlikeNotice = async (crewId, noticeId, userId) => {
  try {
    // 1. 요청을 보낸 사용자가 해당 크루의 맴버인지 확인
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        crewId: parseInt(crewId, 10),
        userId: userId,
      },
    });

    if (!crewMember) {
      const error = new Error(
        "좋아요 취소 권한이 없습니다. 크루 멤버인지 확인하세요."
      );
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 2. 좋아요를 찾아서 삭제
    const existingLike = await prisma.crewNoticeLike.findFirst({
      where: {
        crewNoticeId: parseInt(noticeId, 10),
        crewMemberId: crewMember.id,
      },
    });

    if (!existingLike) {
      const error = new Error("좋아요를 찾을 수 없습니다.");
      error.statusCode = 404;
      error.errorCode = "LIKE_NOT_FOUND";
      throw error;
    }

    // 3. 좋아요 삭제
    await prisma.crewNoticeLike.delete({
      where: {
        id: existingLike.id,
      },
    });

    return { message: "좋아요가 취소되었습니다." };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("좋아요 취소 중 오류가 발생했습니다.");
  }
};

// 2. 공지 댓글 목록 조회
export const getComments = async (noticeId) => {
  try {
    const comments = await prisma.crewNoticeComment.findMany({
      where: {
        crewNoticeId: noticeId,
      },
      select: {
        id: true,
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
      orderBy: {
        createdAt: "asc",
      },
    });
    return comments;
  } catch (error) {
    throw new Error("댓글 목록을 조회하는 중 오류가 발생했습니다.");
  }
};

/**
 * 3. 공지 댓글 작성
 * @param {number} crewId - 크루 ID
 * @param {number} noticeId - 공지 ID
 * @param {number} userId - 사용자 ID
 * @param {object} commentData - { content } 댓글 데이터
 */
export const createComment = async (crewId, noticeId, userId, commentData) => {
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
        "댓글 작성 권한이 없습니다. 크루 멤버인지 확인하세요."
      );
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 3. 댓글을 생성하고, 작성자(crewMember) 정보를 연결합니다.
    const newComment = await prisma.crewNoticeComment.create({
      data: {
        content: commentData.content,
        createdAt: new Date(),
        crewNotice: {
          connect: {
            id: parseInt(noticeId, 10),
          },
        },
        crewMember: {
          connect: {
            id: crewMember.id,
          },
        },
      },
    });
    return newComment;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("댓글 작성 중 오류가 발생했습니다.");
  }
};

/**
 * 4. 공지 댓글 수정
 */
export const updateComment = async (commentId, userId, commentUpdateData) => {
  try {
    // 1. 수정하려는 댓글의 작성자 정보를 가져옵니다.
    const comment = await prisma.crewNoticeComment.findUnique({
      where: { id: commentId },
      select: {
        crewMember: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!comment) {
      const error = new Error("수정할 댓글을 찾을 수 없습니다.");
      error.statusCode = 404;
      error.errorCode = "COMMENT_NOT_FOUND";
      throw error;
    }

    // 2. 요청을 보낸 사용자와 댓글 작성자가 동일 인물인지 확인합니다.
    if (comment.crewMember.userId !== userId) {
      const error = new Error("댓글을 수정할 권한이 없습니다.");
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 3. 데이터를 수정합니다.
    const updatedComment = await prisma.crewNoticeComment.update({
      where: {
        id: commentId,
      },
      data: {
        content: commentUpdateData.content,
        modifiedAt: new Date(), // 수정 시각 기록
      },
    });

    return updatedComment;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("댓글 수정 중 오류가 발생했습니다.");
  }
};

/*
 * 5. 공지 댓글 삭제
 */
export const deleteComment = async (commentId, userId) => {
  try {
    // 1. 삭제하려는 댓글의 작성자 정보를 가져옴
    const comment = await prisma.crewNoticeComment.findUnique({
      where: { id: commentId },
      select: {
        crewMember: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!comment) {
      const error = new Error("삭제할 댓글을 찾을 수 없습니다.");
      error.statusCode = 404;
      error.errorCode = "COMMENT_NOT_FOUND";
      throw error;
    }

    // 2. 요청을 보낸 사용자와 댓글 작성자가 동일 인물인지 확인
    if (comment.crewMember.userId !== userId) {
      const error = new Error("댓글을 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      error.errorCode = "FORBIDDEN";
      throw error;
    }

    // 3. 댓글 데이터 삭제
    await prisma.crewNoticeComment.delete({
      where: {
        id: commentId,
      },
    });

    return { message: "댓글이 성공적으로 삭제되었습니다." };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new Error("댓글 삭제 중 오류가 발생했습니다.");
  }
};
