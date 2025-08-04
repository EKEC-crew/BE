import { prisma } from "../../../../db.config.js";

// Prisma의 create()메소드는 DB에 저장하는 메소드
export const CrewPlanRepository = {
    createPlan: async (crewId, data) => {
        const { crewMemberId, day, ...rest } = data;

        return await prisma.crewPlan.create({
          data: {
            crewId: Number(crewId), //URL에서 받기
            crewMemberId: Number(crewMemberId), // crewMember 관계 설정
            day: new Date(day), //날짜 세팅
            ...rest, // 나머지 정보는 DTO에서 받기
            crewPlanRequest: {
              create: {
                crewMemberId: crewMemberId,
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
            crewMember: {
                include: {
                    user: {
                        select: {
                            nickname: true
                        }
                    }
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
          crewMember: {
            include: {
              user: {
                select: {
                  nickname: true,
                },
              },
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

    findPlanListByCrewId: async (crewId, page = 1, size = 10) => {
      const skip = (page - 1) * size;
      
      const [totalCount, plans] = await Promise.all([
        prisma.crewPlan.count({
          where: {
            crewId: Number(crewId),
          }
        }),
        prisma.crewPlan.findMany({
          where: {
            crewId: Number(crewId),
          },
          orderBy: {
            day: 'desc',
          },
          skip,
          take: size,
          include: {
            crew: {
              select: {
                title: true,
              },
            },
            crewMember: {
              include: {
                user: {
                  select: {
                    nickname: true,
                  }
                }
              }
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
      ]);

      return {
        plans,
        pagination: {
          totalCount,
          currentPage: page,
          pageSize: size,
          totalPages: Math.ceil(totalCount / size)
        }
      };
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
        data: updatedData,
        include: {
          crew: { select: { title: true } },
          crewMember: {
            include: {
              user: { select: { nickname: true } },
            },
          },
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
      // 트랜잭션을 사용하여 관련 데이터들을 먼저 삭제
      return await prisma.$transaction(async (tx) => {
        // 1. CrewPlanComment 삭제
        await tx.crewPlanComment.deleteMany({
          where: {
            crewPlanId: Number(planId)
          }
        });

        // 2. CrewPlanRequest 삭제
        await tx.crewPlanRequest.deleteMany({
          where: {
            crewPlanId: Number(planId)
          }
        });

        // 3. CrewPlanLike 삭제
        await tx.crewPlanLike.deleteMany({
          where: {
            planId: Number(planId)
          }
        });

        // 4. Alarm 삭제 (planId가 있는 경우)
        await tx.alarm.deleteMany({
          where: {
            planId: Number(planId)
          }
        });

        // 5. 마지막으로 CrewPlan 삭제
        return await tx.crewPlan.delete({
          where: {
            id: Number(planId),
            crewId: Number(crewId)
          }
        });
      });
    }
    
}

export const CrewPlanCommentRepository = {
  
  /**
   * 댓글 생성
   */
  createComment: async (crewId, planId, crewMemberId, content, isPublic = true) => {
    return await prisma.crewPlanComment.create({
      data: {
        content,
        crewPlanId: Number(planId),
        crewMemberId: Number(crewMemberId),
        isPublic: isPublic,
      },
      include: {
        crewMember: {
          include: {
            user: {
              select: {
                nickname: true,
                image: true,
              }
            }
          }
        }
      }
    })
  },


  /**
   * 댓글 단건 조회 (crewId, planId도 같이 검증)
   */
  findCommentById: async (crewId, planId, commentId) => {
    return await prisma.crewPlanComment.findFirst({
      where: {
        id: Number(commentId),
        crewPlanId: Number(planId),
        crewPlan: {
          crewId: Number(crewId),
        },
      },
      include:{
        crewMember: {
          include: {
            user: {
              select: {
                nickname: true,
                image: true,
              }
            }
          }
        }
      }
    })
  },

  /**
   * 특정 크루의 특정 일정의 댓글 전체 조회 (페이징 포함) 
   */
  findAllCommentsByPlan: async ({crewId, planId, page = 1, size = 10}) => {
    const skip = (page - 1) * size; // 몇개를 건너뛸지 계산
    //ex) page = 2, size = 10 -> 10개 건너뛰고 11번째부터 가져옴

    /**
     *  Prisma 쿼리 2개를 동시에 실행 (병렬 Promise)
     * - totalCount: 전체 댓글 수 → 페이지 수 계산용
     * - comments: 실제 조회된 댓글 목록
     * 
     * - skip : 어디서부터 가져올지
     * - take : 몇개를 가져올지
     * skip = 10, take = 10 -> 11번째부터 10개를 가져옴
     */
    const [totalCount, comments] = await Promise.all([
      prisma.crewPlanComment.count({
        where: {
          crewPlanId: Number(planId),
          crewPlan: {
            crewId: Number(crewId),
          }
        }
      }),
      prisma.crewPlanComment.findMany({
        where: {
          crewPlanId: Number(planId),
          crewPlan: {
            crewId: Number(crewId),
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip, 
        take: size,
        include: {
          crewMember: {
            include: {
              user: {
                select: {
                  id: true,
                  nickname: true,
                  image: true,
                }
              }
            }
          }
        }
      })
    ]);

    return {
      comments,
      pagination: {
        totalCount,
        currentPage: page,
        pageSize: size,
        totalPages: Math.ceil(totalCount / size)
      }
    };
  },


  /**
   * 댓글 수정
   */
  updateCommentById: async (crewId, planId, commentId, content) => {
    // 먼저 존재 여부 확인
    const comment = await prisma.crewPlanComment.findFirst({
      where: {
        id: Number(commentId),
        crewPlanId: Number(planId),
        crewPlan: {
          crewId: Number(crewId),
      },
    },
    });

    if (!comment) return null;

    return await prisma.crewPlanComment.update({
      where: { id: Number(commentId)},
      data: { content },
      include: {
        crewMember: {
          include: {
            user: {
              select: {
                nickname: true,
                image: true,
              }
            }
          }
        }
      }
    })
  },

  /**
   * 댓글 삭제
   */
  deleteCommentById: async (crewId, planId, commentId) => {
    // 먼저 존재 여부 확인
    const comment = await prisma.crewPlanComment.findFirst({
      where: {
        id: Number(commentId),
        crewPlanId: Number(planId),
        crewPlan: {
          crewId: Number(crewId),
        }
      }
    });

    if (!comment) return null;

    return await prisma.crewPlanComment.delete({
      where: { id: Number(commentId) },
    });
  }
}

