import { prisma } from "../../../../db.config.js";

// Prisma의 create()메소드는 DB에 저장하는 메소드
export const CrewPlanRepository = {
    createPlan: async (crewId, data) => {
        const { crewMemberId, day, ...rest } = data;

        return await prisma.crewPlan.create({
          data: {
            crewId: crewId, //URL에서 받기
            data: new Date(day), //날짜 세팅
            ...rest, // 나머지 정보는 DTO에서 받기
            crewPlanRequest: {
              create: {
                memberId: crewMemberId,
                status: 0
              },
            },
          },
          include: {
            crew: {
                select: {
                    title: true
                }
            },
            crewPlanRequest: {
                include: {
                  crewMember: {
                    include: {
                      user: {
                        select: {
                          nickname: true
                        }
                      },
                    },
                  },
                },
            },
          },
        });
    }
}