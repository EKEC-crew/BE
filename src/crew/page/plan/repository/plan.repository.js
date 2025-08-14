import { prisma } from "../../../../db.config.js";

// Prisma의 create()메소드는 DB에 저장하는 메소드
export const CrewPlanRepository = {
    createPlan: async (crewId, data, crewMemberId) => {
        const { day, ...rest } = data;

        return await prisma.crewPlan.create({
          data: {
            crewId: Number(crewId), //URL에서 받기
            crewMemberId: Number(crewMemberId), // 서비스에서 결정된 crewMemberId 사용
            day: new Date(day), //날짜 세팅
            ...rest, // 나머지 정보는 DTO에서 받기
            crewPlanRequest: {
              create: {
                crewMemberId: Number(crewMemberId),
                status: 0
              },
            },
          },
          select: {
            id: true,
            title: true,
            content: true,
            day: true,
            type: true,
            isRequired: true,
            allowComments: true,
            allowPrivateComments: true,
            allowExternalShare: true,
            hasFee: true,
            fee: true,
            feePurpose: true,
            commentCount: true,
            likeCount: true,
            createdAt: true,
            crew: {
                select: {
                    title: true
                }
            },
            crewMember: {
                select: {
                    user: {
                        select: {
                            nickname: true,
                            id: true,
                            image: true
                        }
                    }
                }
            },
            crewPlanRequest: {
                select: {
                  crewMember: {
                    select: {
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
        select: {
          id: true,
          title: true,
          content: true,
          day: true,
          type: true,
          isRequired: true,
          allowComments: true,
          allowPrivateComments: true,
          allowExternalShare: true,
          hasFee: true,
          fee: true,
          feePurpose: true,
          commentCount: true,
          likeCount: true,
          createdAt: true,
          crew: {
            select: {
              title: true,
            },
          },
          crewMember: {
            select: {
              user: {
                select: {
                  nickname: true,
                  id: true,
                  image: true
                },
              },
            },
          },
          crewPlanRequest: {
            select: {
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
          select: {
            id: true,
            title: true,
            content: true,
            day: true,
            type: true,
            isRequired: true,
            allowComments: true,
            allowPrivateComments: true,
            allowExternalShare: true,
            hasFee: true,
            fee: true,
            feePurpose: true,
            commentCount: true,
            likeCount: true,
            createdAt: true,
            crew: {
              select: {
                title: true,
              },
            },
            crewMember: {
              select: {
                user: {
                  select: {
                    nickname: true,
                    id: true,
                    image: true
                  }
                }
              }
            },
            crewPlanRequest: {
              select: {
                crewMember: {
                  select: {
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

      const totalPages = Math.ceil(totalCount / size);
      
      return {
        plans,
        pagination: {
          totalElements: totalCount,
          currentPage: page,
          pageSize: size,
          totalPages: totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1
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
        select: {
          id: true,
          title: true,
          content: true,
          day: true,
          type: true,
          isRequired: true,
          allowComments: true,
          allowPrivateComments: true,
          allowExternalShare: true,
          hasFee: true,
          fee: true,
          feePurpose: true,
          commentCount: true,
          likeCount: true,
          createdAt: true,
          crew: { select: { title: true } },
          crewMember: {
            select: {
              user: { select: { nickname: true, id: true } },
            },
          },
          crewPlanRequest: {
            select: {
              crewMember: {
                select: {
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
    },

    // 사용자가 신청완료한 다가오는 일정 조회
    findUpcomingPlansByUserId: async (userId, page = 1, size = 5) => {
      const skip = (page - 1) * size;
      // 한국 시간(KST, UTC+9)으로 오늘 날짜 설정
      const today = new Date();
      today.setHours(today.getHours() + 9); // UTC+9 (한국 시간)
      today.setHours(0, 0, 0, 0); // 오늘 날짜의 시작 (00:00:00)

      //Promise.all : 여러 비동기 작업을 동시에 실행하고 모든 결과를 기다리는 메소드
      const [totalCount, plans] = await Promise.all([
        // 첫 번째 Promise: 전체 개수 조회
        prisma.crewPlanRequest.count({
          where: {
            crewMember: {
              userId: Number(userId)
            },
            status: 1, // 신청완료 상태
            crewPlan: {
              day: {
                gte: today // 오늘 이후의 일정만(today: 한국시간 기준 오늘 날짜)
              }
            }
          }
        }),
        // 두 번째 Promise: 일정 목록 조회
        prisma.crewPlanRequest.findMany({
          where: {
            crewMember: {
              userId: Number(userId)
            },
            status: 1, // 신청완료 상태
            crewPlan: {
              day: {
                gte: today // 오늘 이후의 일정만
              }
            }
          },
          orderBy: {
            crewPlan: {
              day: 'asc' // 날짜순으로 정렬 (가까운 일정부터)
            }
          },
          skip,
          take: size,
          select: {
            crewPlan: {
              select: {
                id: true,
                title: true,
                day: true,
                crew: {
                  select: {
                    title: true
                  }
                }
              }
            }
          }
        })
      ]);

      const totalPages = Math.ceil(totalCount / size);
      
      // 일정 데이터를 가공하여 daysUntil 계산
      const processedPlans = plans.map(request => {
        const plan = request.crewPlan;
        const planDate = new Date(plan.day); // 일정 날짜
        // 한국 시간(KST, UTC+9)으로 오늘 날짜 설정
        const todayDate = new Date(); // 오늘 날짜
        todayDate.setHours(todayDate.getHours() + 9); // UTC+9 (한국 시간)
        todayDate.setHours(0, 0, 0, 0);
        planDate.setHours(0, 0, 0, 0);
        
        const daysUntil = Math.ceil((planDate - todayDate) / (1000 * 60 * 60 * 24)); // 일정 날짜와 오늘날짜의 차이로 남은 날짜 계산 -> D-Day까지 몇일 남았는지 계산
        
        return {
          id: plan.id,
          crew_name: plan.crew.title,
          title: plan.title,
          day: plan.day,
          daysUntil: daysUntil
        };
      });
      
      return {
        plans: processedPlans,
        pagination: {
          totalElements: totalCount,
          currentPage: page,
          pageSize: size,
          totalPages: totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1
        }
      };
    }
    
}



export const CrewPlanCommentRepository = {
  
  /**
   * 댓글 생성
   */
  createComment: async (crewId, planId, crewMemberId, content, isPublic = true) => {
    // 트랜잭션으로 댓글 생성 + commentCount 증가
    return await prisma.$transaction(async (tx) => {
      // 댓글 생성
      const comment = await tx.crewPlanComment.create({
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
                  id: true
                }
              }
            }
          }
        }
      });

      // commentCount 증가
      await tx.crewPlan.update({
        where: { id: Number(planId) },
        data: { commentCount: { increment: 1 } }
      });

      return comment;
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
                id: true
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
                  id: true
                }
              }
            }
          }
        }
      })
    ]);

    const totalPages = Math.ceil(totalCount / size);
    
    return {
      comments,
      pagination: {
        totalElements: totalCount,
        currentPage: page,
        pageSize: size,
        totalPages: totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
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
                id: true
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

    return await prisma.$transaction(async (tx) => {
      //댓글 삭제
      const deletedComment = await tx.crewPlanComment.delete({
        where: { id: Number(commentId) },
      });

      // commentCount 감소
      await tx.crewPlan.update({
        where: { id: Number(planId) },
        data: { commentCount: { decrement: 1 } }
      });

      return deletedComment;
    })
  }
}

// 일정 좋아요 Repository
export const CrewPlanLikeRepository = {
  
  /**
   * 일정 좋아요 추가
   */
  createLike: async (planId, crewMemberId) => {
    // 이미 좋아요가 있는지 확인
    const existingLike = await prisma.crewPlanLike.findUnique({
      where: {
        planId_crewMemberId: {
          planId: Number(planId),
          crewMemberId: Number(crewMemberId)
        }
      }
    });

    if (existingLike) {
      throw new Error("이미 좋아요를 누른 일정입니다.");
    }

    /**
     * 왜 트랜잭션을 사용했나?
     * 현재 코드에서 2가지 작업을 수행합니다:
     * - CrewPlanLike 테이블에 좋아요 추가
     * - CrewPlan 테이블의 likeCount 증가
     * 
     * tx : 트랜잭션 컨텍스트(특별한 prisma 객체)
     * - 트랜잭션이 실행되는 동안의 작업환경
     * - 이 tx로 하는 모든 작업들이 하나로 묶임
     */
    // 트랜잭션으로 좋아요 추가 + likeCount 증가
    return await prisma.$transaction(async (tx) => {
      // 좋아요 추가
      const like = await tx.crewPlanLike.create({
        data: {
          planId: Number(planId),
          crewMemberId: Number(crewMemberId),
          isLiked: 1
        }
      });

      // likeCount 증가
      await tx.crewPlan.update({
        where: { id: Number(planId) },
        data: { likeCount: { increment: 1 } }
      });

      return like;
    });
  },

  /**
   * 일정 좋아요 취소
   */
  deleteLike: async (planId, crewMemberId) => {
    // 좋아요가 있는지 확인
    const existingLike = await prisma.crewPlanLike.findUnique({
      where: {
        planId_crewMemberId: {
          planId: Number(planId),
          crewMemberId: Number(crewMemberId)
        }
      }
    });

    if (!existingLike) {
      throw new Error("좋아요를 누르지 않은 일정입니다.");
    }

    // 트랜잭션으로 좋아요 삭제 + likeCount 감소
    return await prisma.$transaction(async (tx) => {
      // 좋아요 삭제
      await tx.crewPlanLike.delete({
        where: {
          planId_crewMemberId: {
            planId: Number(planId),
            crewMemberId: Number(crewMemberId)
          }
        }
      });

      // likeCount 감소 (0 미만으로 가지 않도록)
      await tx.crewPlan.update({
        where: { id: Number(planId) },
        data: { likeCount: { decrement: 1 } }
      });

      return { message: "좋아요가 취소되었습니다." };
    });
  },


}

/**
 * 크루 일정 신청하는 Repository
 */
export const CrewPlanRequestRepository = {

  /**
   * 일정 신청
   */
  createRequest: async (planId, crewMemberId) => {
    //이미 신청했는지 확인
    const existingRequest = await prisma.crewPlanRequest.findFirst({
      where: {
        crewPlanId: Number(planId),
        crewMemberId: Number(crewMemberId)
      }
    });

    if (existingRequest) {
      throw new Error("이미 신청한 일정입니다.");
    }

    // 신청 생성 (status: 1 = 신청완료)
    return await prisma.crewPlanRequest.create({
      data: {
        crewPlanId: Number(planId),
        crewMemberId: Number(crewMemberId),
        status: 1
      },
      include: {
        crewMember: {
          include: {
            user: {
              select: {
                nickname: true,
                id: true
              }
            }
          }
        }
      }
    });
  },


}