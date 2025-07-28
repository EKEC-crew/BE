import { prisma } from "../../../../db.config.js";

// Prisma의 create()메소드는 DB에 저장하는 메소드
export const CrewPlanRepository = {
    createPlan: async (crewId, data) => {
        const { crewMemberId, day, ...rest } = data;

        return await prisma.crewPlan.create({
          data: {
            crewId: Number(crewId), //URL에서 받기
            day: new Date(day), //날짜 세팅
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
    },

    findPlanById: async (crewId, planId) => {
      return await prisma.crewPlan.findFirst({
        where: {
          id: Number(planId),
          crewId: Number(crewId)
        },
        include: {
          crew: {
            select: {
              title: true,
            },
          },
          crewPlanRequest: {
            include: {
              crewMember: {
                include: {
                  user: {
                    select: {
                      nickname: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    },

    findPlanListByCrewId: async (crewId) => {
      return await prisma.crewPlan.findMany({
        where: {
          crewId: Number(crewId),
        },
        orderBy: {
          day: 'desc',
        },
        include: {
          crew: {
            select: {
              title: true,
            },
          },
          crewPlanRequest: {
            include: {
              crewMember: {
                include: {
                  user: {
                    select: {
                      nickname: true,
                    }
                  }
                }
              }
            }
          }
        }
      })
    },

    updatePlanById: async (crewId, planId, data) => {
      const updatedData = {};

      for (const key in data) {
        if (data[key] !== undefined) {
          updatedData[key] = data[key];
        }
      }

      return await prisma.crewPlan.update({
        where: { id: Number(planId) },
        data: updateData,
        include: {
          crew: { select: { title: true } },
          crewPlanRequest: {
            include: {
              crewMember: {
                include: {
                  user: { select: { nickname: true } },
                },
              },
            },
          },
        },
      })
    },

    deletePlanById: async (crewId, planId) => {
      return await prisma.crewPlan.delete({
        where: {
          id: Number(planId),
          crewId: Number(crewId)
        }
      })
    }




    
}

