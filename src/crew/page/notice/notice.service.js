// Prisma 클라이언트 가져오기
import { PrismaCilent } from "@prisma/client";
const prisma = new PrismaCilent();

// // 특정 크루 공지 작성 로직
// export const createNotice = async (crewId, noticeData) => {
//   // 데이터베이스에 공지사항 생성
//   // schema.prisma 파일에 Notice 모델 정의 필요
//   // 우선 title, content, crewId 필드를 가진다고 가정
//   const newNotice = await prisma.notice.create({
//     data: {
//       title: noticeData.title,
//       content: noticeData.content,
//       crew: {
//         connect: {
//           id: parseInt(crewId, 10),
//         },
//       },
//     },
//   });
//   return newNotice;
// };

// 1. 특정 크루 공지 리스트 조회
export const getNotices = async (crewId) => {
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
};

/**
 * 2. 특정 크루 공지 작성
 * @param {string} crewId - 크루 ID
 * @param {number} userId - 현재 로그인한 사용자의 ID (인증 미들웨어에서 받음)
 * @param {object} noticeData - { title, content } 공지 데이터
 */

export const createNotice = async (crewId, userId, noticeData) => {
  // 1. 요청을 보낸 사용자가 해당 크루의 맴버인지 확인
  const crewMember = await prisma.crewMember.findFirst({
    where: {
      crewId: parseInt(crewId, 10),
      userId: userId,
    },
  });

  // 2. 크루 맴버가 아니라면 에러 발생
  if (!crewMember) {
    throw new Error("공지 작성 권한이 없습니다. 크루 멤버인지 확인하세요.");
  }
};
