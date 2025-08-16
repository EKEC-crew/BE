import { prisma } from "../../../../db.config.js";
import {
  InvalidInputValueError,
  NotFoundPlanError,
  CrewMemberNotFoundError,
  PermissionDeniedError,
} from "../../../../error.js";

import * as planRepository from "../repository/plan.repository.js";
import * as planResponse from "../dto/response/plan.response.dto.js";
import * as planRequest from "../dto/request/plan.request.dto.js";
import { eventEmitter } from "../../../../index.js";

//함수이름 : 함수정의
export const CrewPlanService = {
  //일정 생성 서비스
  createPlan: async (crewId, requestDto, userId) => {
    const req = new planRequest.CreateCrewPlanRequest(requestDto);

    if (
      !req.title ||
      !req.day ||
      typeof req.type !== "number" ||
      !req.content
    ) {
      throw new InvalidInputValueError(
        "필수 항목(title, day, type, content)이 누락되었습니다.",
      );
    }

    const crew = await prisma.crew.findUnique({
      where: { id: Number(crewId) },
    });
    if (!crew) {
      throw new InvalidInputValueError("존재하지 않는 crewId입니다.", {
        crewId,
      });
    }

    // JWT 토큰의 userId로 crewMember 정보 조회
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        crewId: Number(crewId),
        userId: Number(userId),
      },
    });

    if (!crewMember) {
      throw new CrewMemberNotFoundError("해당 크루의 멤버가 아닙니다.", {
        crewId,
        userId,
      });
    }

    // 권한 검증: 정기모임(type=1)은 운영진(role=1)과 크루장(role=2)만 생성 가능
    if (req.type === 1 && crewMember.role < 1) {
      throw new PermissionDeniedError(
        "정기모임은 운영진과 크루장만 생성할 수 있습니다.",
        {
          crewId,
          userId,
          userRole: crewMember.role,
          planType: req.type,
        },
      );
    }

    try {
      const plan = await planRepository.CrewPlanRepository.createPlan(
        Number(crewId),
        req,
        crewMember.id,
      );

      // 일정 생성 후 크루 멤버들에게 알림 발송
      const crewMembers = await prisma.crewMember.findMany({
        where: {
          crewId: Number(crewId),
          userId: {
            not: Number(userId), // 일정 생성자 제외
          },
        },
        select: {
          userId: true,
        },
      });

      const userIds = crewMembers.map((member) => member.userId);

      // 알림 이벤트 발송
      eventEmitter.emit("SCHEDULE_CREATED", {
        userId: userIds, // 크루 멤버들의 유저 ID 배열(생성자 제외)
        targetId: {
          crewId: Number(crewId),
          planId: plan.id,
        },
      });

      return new planResponse.CreateCrewPlanResponse(plan);
    } catch (error) {
      if (error.message === "해당 크루의 멤버가 아닙니다.") {
        throw new CrewMemberNotFoundError("해당 크루의 멤버가 아닙니다.", {
          crewId,
          userId,
        });
      }
      throw error;
    }
  },

  //특정 일정 조회 서비스
  getPlanById: async (crewId, planId, userId) => {
    if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
      throw new InvalidInputValueError(
        "crewId 또는 planId가 올바르지 않습니다.",
        { crewId, planId },
      );
    }

    const plan = await planRepository.CrewPlanRepository.findPlanById(
      Number(crewId),
      Number(planId),
    );

    if (!plan) {
      throw new NotFoundPlanError("해당 일정이 존재하지 않습니다.", {
        crewId,
        planId,
      });
    }

    // 사용자의 좋아요 및 신청 상태 조회
    let isLiked = false;
    let isApplied = false;

    if (userId) {
      const crewMember = await prisma.crewMember.findFirst({
        where: {
          crewId: Number(crewId),
          userId: Number(userId),
        },
      });

      if (crewMember) {
        // 좋아요 상태 조회
        const likeStatus = await prisma.crewPlanLike.findUnique({
          where: {
            planId_crewMemberId: {
              planId: Number(planId),
              crewMemberId: crewMember.id,
            },
          },
        });
        isLiked = likeStatus !== null; //likeStatus가 null이 아니면 isLiked가 true

        // 신청 상태 조회
        const requestStatus = await prisma.crewPlanRequest.findFirst({
          where: {
            crewPlanId: Number(planId),
            crewMemberId: crewMember.id,
          },
        });
        isApplied = requestStatus !== null; //requestStatus가 null이 아니면 isApplied가 true
      }
    }

    const planWithUserStatus = {
      ...plan,
      isLiked,
      isApplied,
    };

    return new planResponse.GetCrewPlanResponse(planWithUserStatus);
  },

  //일정 리스트로 조회 서비스 (페이징 처리 추가)
  getPlanListByCrewId: async (crewId, page = 1, size = 10, userId) => {
    if (!crewId || isNaN(crewId)) {
      throw new InvalidInputValueError("crewId가 올바르지 않습니다.", {
        crewId,
      });
    }

    const crew = await prisma.crew.findUnique({
      where: { id: Number(crewId) },
    });
    if (!crew) {
      throw new InvalidInputValueError("존재하지 않는 crewId입니다.", {
        crewId,
      });
    }

    const result = await planRepository.CrewPlanRepository.findPlanListByCrewId(
      Number(crewId),
      page,
      size,
    );

    // 사용자의 좋아요 및 신청 상태 조회
    let crewMember = null;
    if (userId) {
      crewMember = await prisma.crewMember.findFirst({
        where: {
          crewId: Number(crewId),
          userId: Number(userId),
        },
      });
    }

    const plansWithUserStatus = await Promise.all(
      result.plans.map(async (plan) => {
        let isLiked = false;
        let isApplied = false;

        if (crewMember) {
          // 좋아요 상태 조회
          const likeStatus = await prisma.crewPlanLike.findUnique({
            where: {
              planId_crewMemberId: {
                planId: plan.id,
                crewMemberId: crewMember.id,
              },
            },
          });
          isLiked = likeStatus !== null; //likeStatus가 null이 아니면 isLiked가 true

          // 신청 상태 조회
          const requestStatus = await prisma.crewPlanRequest.findFirst({
            where: {
              crewPlanId: plan.id,
              crewMemberId: crewMember.id,
            },
          });
          isApplied = requestStatus !== null; //requestStatus가 null이 아니면 isApplied가 true
        }

        return new planResponse.GetCrewPlanResponse({
          ...plan,
          isLiked,
          isApplied,
        });
      }),
    );

    return new planResponse.GetCrewPlanListResponse(
      plansWithUserStatus,
      result.pagination,
    );
  },

  //일정 수정 서비스
  updatePlanById: async (crewId, planId, requestDto) => {
    const req = new planRequest.UpdateCrewPlanRequest(requestDto);
    if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
      throw new InvalidInputValueError(
        "crewId 또는 planId가 올바르지 않습니다.",
        { crewId, planId },
      );
    }
    const crew = await prisma.crew.findUnique({
      where: { id: Number(crewId) },
    });

    if (!crew) {
      throw new InvalidInputValueError("존재하지 않는 crewId입니다.", {
        crewId,
      });
    }
    const plan = await planRepository.CrewPlanRepository.findPlanById(
      Number(crewId),
      Number(planId),
    );
    if (!plan) {
      throw new NotFoundPlanError("해당 일정이 존재하지 않습니다.", {
        crewId,
        planId,
      });
    }

    const updatedPlan = await planRepository.CrewPlanRepository.updatePlanById(
      Number(crewId),
      Number(planId),
      req,
    );
    return new planResponse.GetCrewPlanResponse(updatedPlan);
  },

  //일정 삭제 서비스
  deletePlan: async (crewId, planId) => {
    if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
      throw new InvalidInputValueError(
        "유효하지 않은 crewId 또는 planId입니다.",
        { crewId, planId },
      );
    }

    const plan = await planRepository.CrewPlanRepository.findPlanById(
      Number(crewId),
      Number(planId),
    );
    if (!plan) {
      throw new NotFoundPlanError("삭제할 일정이 존재하지 않습니다.", {
        crewId,
        planId,
      });
    }

    const deletedPlan = await planRepository.CrewPlanRepository.deletePlanById(
      Number(crewId),
      Number(planId),
    );
    if (!deletedPlan) {
      throw new InvalidInputValueError("삭제할 일정이 존재하지 않습니다.", {
        crewId,
        planId,
      });
    }

    return { message: "일정이 성공적으로 삭제되었습니다." };
  },

  //다가오는 일정 리스트 조회 서비스
  getUpcomingPlans: async (page = 1, size = 5, userId) => {
    if (!userId) {
      throw new InvalidInputValueError("사용자 인증이 필요합니다.");
    }

    const result =
      await planRepository.CrewPlanRepository.findUpcomingPlansByUserId(
        Number(userId),
        page,
        size,
      );

    return new planResponse.GetUpcomingPlansResponse(
      result.plans,
      result.pagination,
    );
  },
};

export const CrewPlanCommentService = {
  //일정 댓글 생성 서비스
  createComment: async (crewId, planId, requestDto, userId) => {
    const { content, isPublic = true } = requestDto;

    // 유효성 검사
    if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
      throw new InvalidInputValueError(
        "유효하지 않은 crewId 또는 planId입니다.",
        { crewId, planId },
      );
    }
    if (!content || content.trim().length === 0) {
      throw new InvalidInputValueError("댓글 내용은 필수입니다.");
    }

    //일정 존재 확인
    const plan = await planRepository.CrewPlanRepository.findPlanById(
      Number(crewId),
      Number(planId),
    );
    if (!plan) {
      throw new InvalidInputValueError("해당 크루 일정이 존재하지 않습니다.", {
        crewId,
        planId,
      });
    }

    // JWT 토큰의 userId로 crewMember 정보 조회
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        crewId: Number(crewId),
        userId: Number(userId),
      },
    });

    if (!crewMember) {
      throw new CrewMemberNotFoundError("해당 크루의 멤버가 아닙니다.", {
        crewId,
        userId,
      });
    }

    try {
      const comment =
        await planRepository.CrewPlanCommentRepository.createComment(
          Number(crewId),
          Number(planId),
          crewMember.id,
          content,
          isPublic,
        );
      return new planResponse.CrewPlanCommentResponse(comment);
    } catch (error) {
      if (error.message === "해당 크루의 멤버가 아닙니다.") {
        throw new CrewMemberNotFoundError("해당 크루의 멤버가 아닙니다.", {
          crewId,
          planId,
          userId,
        });
      }
      throw error;
    }
  },

  //일정 댓글 단건 조회 서비스
  getCommentById: async (crewId, planId, commentId) => {
    if (
      !crewId ||
      !planId ||
      !commentId ||
      isNaN(crewId) ||
      isNaN(planId) ||
      isNaN(commentId)
    ) {
      throw new InvalidInputValueError("유효하지 않은 파라미터입니다.", {
        crewId,
        planId,
        commentId,
      });
    }

    const comment =
      await planRepository.CrewPlanCommentRepository.findCommentById(
        Number(crewId),
        Number(planId),
        Number(commentId),
      );
    if (!comment) {
      throw new NotFoundPlanError("해당 댓글이 존재하지 않습니다.", {
        crewId,
        planId,
        commentId,
      });
    }

    return new planResponse.CrewPlanCommentResponse(comment);
  },

  //일정 댓글 리스트 조회 서비스 (페이징 처리)
  getCommentList: async ({ crewId, planId, page = 1, size = 10 }) => {
    if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
      throw new InvalidInputValueError(
        "유효하지 않은 crewId 또는 planId입니다.",
        { crewId, planId },
      );
    }

    // 일정 존재 확인
    const plan = await planRepository.CrewPlanRepository.findPlanById(
      Number(crewId),
      Number(planId),
    );
    if (!plan) {
      throw new InvalidInputValueError("해당 크루 일정이 존재하지 않습니다.", {
        crewId,
        planId,
      });
    }

    const result =
      await planRepository.CrewPlanCommentRepository.findAllCommentsByPlan({
        crewId: Number(crewId),
        planId: Number(planId),
        page: Number(page),
        size: Number(size),
      });

    return {
      comments: result.comments.map(
        (comment) => new planResponse.CrewPlanCommentResponse(comment),
      ),
      pagination: result.pagination,
    };
  },

  //일정 댓글 수정 서비스
  updateComment: async (crewId, planId, commentId, requestDto) => {
    const { content } = requestDto;

    if (
      !crewId ||
      !planId ||
      !commentId ||
      isNaN(crewId) ||
      isNaN(planId) ||
      isNaN(commentId)
    ) {
      throw new InvalidInputValueError("유효하지 않은 파라미터입니다.", {
        crewId,
        planId,
        commentId,
      });
    }
    if (!content || content.trim().length === 0) {
      throw new InvalidInputValueError("댓글 내용은 필수입니다.");
    }

    const comment =
      await planRepository.CrewPlanCommentRepository.updateCommentById(
        Number(crewId),
        Number(planId),
        Number(commentId),
        content,
      );
    if (!comment) {
      throw new NotFoundPlanError("수정할 댓글이 존재하지 않습니다.", {
        crewId,
        planId,
        commentId,
      });
    }

    return new planResponse.CrewPlanCommentResponse(comment);
  },

  //일정 댓글 삭제 서비스
  deleteComment: async (crewId, planId, commentId) => {
    if (
      !crewId ||
      !planId ||
      !commentId ||
      isNaN(crewId) ||
      isNaN(planId) ||
      isNaN(commentId)
    ) {
      throw new InvalidInputValueError("유효하지 않은 파라미터입니다.", {
        crewId,
        planId,
        commentId,
      });
    }

    const comment =
      await planRepository.CrewPlanCommentRepository.deleteCommentById(
        Number(crewId),
        Number(planId),
        Number(commentId),
      );
    if (!comment) {
      throw new NotFoundPlanError("삭제할 댓글이 존재하지 않습니다.", {
        crewId,
        planId,
        commentId,
      });
    }

    return { message: "댓글이 성공적으로 삭제되었습니다." };
  },
};

//일정 좋아요 서비스
export const CrewPlanLikeService = {
  //일정 좋아요 추가 서비스
  likePlan: async (crewId, planId, userId) => {
    if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
      throw new InvalidInputValueError(
        "유효하지 않은 crewId 또는 planId입니다.",
        { crewId, planId },
      );
    }

    // 일정 존재 확인
    const plan = await planRepository.CrewPlanRepository.findPlanById(
      Number(crewId),
      Number(planId),
    );
    if (!plan) {
      throw new NotFoundPlanError("해당 크루 일정이 존재하지 않습니다.", {
        crewId,
        planId,
      });
    }

    // JWT 토큰의 userId로 crewMember 정보 조회
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        crewId: Number(crewId),
        userId: Number(userId),
      },
    });

    if (!crewMember) {
      throw new CrewMemberNotFoundError("해당 크루의 멤버가 아닙니다.", {
        crewId,
        userId,
      });
    }

    try {
      await planRepository.CrewPlanLikeRepository.createLike(
        Number(planId),
        crewMember.id,
      );

      // 업데이트된 일정 정보를 다시 조회해서 최신 likeCount 반환
      const updatedPlan = await planRepository.CrewPlanRepository.findPlanById(
        Number(crewId),
        Number(planId),
      );

      return {
        message: "좋아요가 추가되었습니다.",
        planId: Number(planId),
        likeCount: updatedPlan.likeCount,
        isLiked: true,
      };
    } catch (error) {
      if (error.message === "이미 좋아요를 누른 일정입니다.") {
        throw new InvalidInputValueError("이미 좋아요를 누른 일정입니다.", {
          crewId,
          planId,
          userId,
        });
      }
      throw error;
    }
  },

  //일정 좋아요 취소 서비스
  unlikePlan: async (crewId, planId, userId) => {
    if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
      throw new InvalidInputValueError(
        "유효하지 않은 crewId 또는 planId입니다.",
        { crewId, planId },
      );
    }

    // 일정 존재 확인
    const plan = await planRepository.CrewPlanRepository.findPlanById(
      Number(crewId),
      Number(planId),
    );
    if (!plan) {
      throw new NotFoundPlanError("해당 크루 일정이 존재하지 않습니다.", {
        crewId,
        planId,
      });
    }

    // JWT 토큰의 userId로 crewMember 정보 조회
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        crewId: Number(crewId),
        userId: Number(userId),
      },
    });

    if (!crewMember) {
      throw new CrewMemberNotFoundError("해당 크루의 멤버가 아닙니다.", {
        crewId,
        userId,
      });
    }

    try {
      await planRepository.CrewPlanLikeRepository.deleteLike(
        Number(planId),
        crewMember.id,
      );

      // 업데이트된 일정 정보를 다시 조회해서 최신 likeCount 반환
      const updatedPlan = await planRepository.CrewPlanRepository.findPlanById(
        Number(crewId),
        Number(planId),
      );

      return {
        message: "좋아요가 취소되었습니다.",
        planId: Number(planId),
        likeCount: updatedPlan.likeCount,
        isLiked: false,
      };
    } catch (error) {
      if (error.message === "좋아요를 누르지 않은 일정입니다.") {
        throw new InvalidInputValueError("좋아요를 누르지 않은 일정입니다.", {
          crewId,
          planId,
          userId,
        });
      }
      throw error;
    }
  },
};

// 일정 신청 서비스
export const CrewPlanRequestService = {
  // 일정 신청
  applyToPlan: async (crewId, planId, userId) => {
    if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
      throw new InvalidInputValueError(
        "유효하지 않은 crewId 또는 planId입니다.",
        { crewId, planId },
      );
    }

    //일정 존재 확인
    const plan = await planRepository.CrewPlanRepository.findPlanById(
      Number(crewId),
      Number(planId),
    );
    if (!plan) {
      throw new NotFoundPlanError("해당 크루 일정이 존재하지 않습니다.", {
        crewId,
        planId,
      });
    }

    // JWT 토큰의 userId로 crewMember 정보 조회
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        crewId: Number(crewId),
        userId: Number(userId),
      },
    });

    //해당 크루의 멤버인지 확인
    if (!crewMember) {
      throw new CrewMemberNotFoundError("해당 크루의 멤버가 아닙니다.", {
        crewId,
        userId,
      });
    }

    try {
      const request =
        await planRepository.CrewPlanRequestRepository.createRequest(
          Number(planId),
          crewMember.id,
        );

      return new planResponse.CrewPlanRequestResponse(request);
    } catch (error) {
      if (error.message === "이미 신청한 일정입니다.") {
        throw new InvalidInputValueError("이미 신청한 일정입니다.", {
          crewId,
          planId,
          userId,
        });
      }
      throw error;
    }
  },
};
