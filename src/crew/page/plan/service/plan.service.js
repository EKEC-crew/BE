import { prisma } from "../../../../db.config.js";
import { InvalidInputValueError, NotFoundPlanError } from "../../../../error.js";

import * as planRepository from "../repository/plan.repository.js";
import * as planResponse from "../dto/response/plan.response.dto.js";
import * as planRequest from "../dto/request/plan.request.dto.js";

//함수이름 : 함수정의
export const CrewPlanService = {
    
    //일정 생성 서비스
    createPlan: async (crewId, requestDto) => {
        const req = new planRequest.CreateCrewPlanRequest(requestDto);

        if (!req.title || !req.day || typeof req.type !== 'number' || !req.content || !req.crewMemberId) {
            throw new InvalidInputValueError("필수 항목(title, day, type, content, crewMemberId)이 누락되었습니다.")
        }

        const crew = await prisma.crew.findUnique({ where: { id: Number(crewId) } });
        if (!crew) {
            throw new InvalidInputValueError("존재하지 않는 crewId입니다.", { crewId });
        }

        const plan = await planRepository.CrewPlanRepository.createPlan(Number(crewId), req);
        return new planResponse.CreateCrewPlanResponse(plan);
    },

    //특정 일정 조회 서비스
    getPlanById: async (crewId, planId) => {
        if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
            throw new InvalidInputValueError("crewId 또는 planId가 올바르지 않습니다.", {crewId, planId});
        }

        const plan = await planRepository.CrewPlanRepository.findPlanById(Number(crewId), Number(planId));

        if (!plan) {
            throw new NotFoundPlanError("해당 일정이 존재하지 않습니다.", {crewId, planId});
        }
        
        return new planResponse.GetCrewPlanResponse(plan);
    },

    //일정 리스트로 조회 서비스 (페이징 처리 추가)
    getPlanListByCrewId: async (crewId, page = 1, size = 10) => {
        if (!crewId || isNaN(crewId)) {
            throw new InvalidInputValueError("crewId가 올바르지 않습니다.", {crewId});
        }

        const crew = await prisma.crew.findUnique({ where: {id: Number(crewId)} });
        if (!crew) {
            throw new InvalidInputValueError("존재하지 않는 crewId입니다.", {crewId});
        }

        const result = await planRepository.CrewPlanRepository.findPlanListByCrewId(Number(crewId), page, size);
        
        return {
            plans: result.plans.map((plan) => new planResponse.GetCrewPlanResponse(plan)),
            pagination: result.pagination
        };
    },

    //일정 수정 서비스
    updatePlanById: async (crewId, planId, requestDto) => {
        const req = new planRequest.UpdateCrewPlanRequest(requestDto);
        if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
            throw new InvalidInputValueError("crewId 또는 planId가 올바르지 않습니다.", {crewId, planId});
        }
        const crew= await prisma.crew.findUnique({ where: {id: Number(crewId)} });
        
        if (!crew) {
            throw new InvalidInputValueError("존재하지 않는 crewId입니다.", {crewId});
        }
        const plan = await planRepository.CrewPlanRepository.findPlanById(Number(crewId), Number(planId));
        if (!plan) {
            throw new NotFoundPlanError("해당 일정이 존재하지 않습니다.", {crewId, planId});
        }

        const updatedPlan = await planRepository.CrewPlanRepository.updatePlanById(Number(crewId), Number(planId), req);
        return new planResponse.GetCrewPlanResponse(updatedPlan);
    },
    
    //일정 삭제 서비스
    deletePlan: async (crewId, planId) => {
        if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
            throw new InvalidInputValueError("유효하지 않은 crewId 또는 planId입니다.", {crewId, planId});
        }
      
        const plan = await planRepository.CrewPlanRepository.findPlanById(Number(crewId), Number(planId));
        if (!plan) {
            throw new NotFoundPlanError("삭제할 일정이 존재하지 않습니다.", { crewId, planId });
        }

        const deletedPlan = await planRepository.CrewPlanRepository.deletePlanById(Number(crewId), Number(planId));
        if (!deletedPlan) {
            throw new InvalidInputValueError("삭제할 일정이 존재하지 않습니다.", { crewId, planId });
        }
        
        return { message: "일정이 성공적으로 삭제되었습니다." };
    }
}

export const CrewPlanCommentService = {

    //일정 댓글 생성 서비스
    createComment: async (crewId, planId, requestDto) => {
        const {crewMemberId, content, isPublic = true} = requestDto;
        
        // 유효성 검사
        if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
            throw new InvalidInputValueError("유효하지 않은 crewId 또는 planId입니다.", { crewId, planId });
        }
        if (!crewMemberId || typeof crewMemberId !== 'number') {
            throw new InvalidInputValueError("유효하지 않은 crewMemberId입니다.");
        }
        if (!content || content.trim().length === 0) {
            throw new InvalidInputValueError("댓글 내용은 필수입니다.");
        }

        //일정 존재 확인
        const plan = await planRepository.CrewPlanRepository.findPlanById(Number(crewId), Number(planId));
        if (!plan) {
            throw new InvalidInputValueError("해당 크루 일정이 존재하지 않습니다.", {crewId, planId});
        }

        const comment = await planRepository.CrewPlanCommentRepository.createComment(Number(crewId), Number(planId), crewMemberId, content, isPublic);
        return new planResponse.CrewPlanCommentResponse(comment);
    },

    //일정 댓글 단건 조회 서비스
    getCommentById: async (crewId, planId, commentId) => {
        if (!crewId || !planId || !commentId || isNaN(crewId) || isNaN(planId) || isNaN(commentId)) {
            throw new InvalidInputValueError("유효하지 않은 파라미터입니다.", { crewId, planId, commentId });
        }

        const comment = await planRepository.CrewPlanCommentRepository.findCommentById(Number(crewId), Number(planId), Number(commentId));
        if (!comment) {
            throw new NotFoundPlanError("해당 댓글이 존재하지 않습니다.", { crewId, planId, commentId });
        }

        return new planResponse.CrewPlanCommentResponse(comment);
    },

    //일정 댓글 리스트 조회 서비스 (페이징 처리)
    getCommentList: async ({crewId, planId, page = 1, size = 10}) => {
        if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
            throw new InvalidInputValueError("유효하지 않은 crewId 또는 planId입니다.", { crewId, planId });
        }

        // 일정 존재 확인
        const plan = await planRepository.CrewPlanRepository.findPlanById(Number(crewId), Number(planId));
        if (!plan) {
            throw new InvalidInputValueError("해당 크루 일정이 존재하지 않습니다.", {crewId, planId});
        }

        const result = await planRepository.CrewPlanCommentRepository.findAllCommentsByPlan({
            crewId: Number(crewId),
            planId: Number(planId),
            page: Number(page),
            size: Number(size)
        });

        return {
            comments: result.comments.map(comment => new planResponse.CrewPlanCommentResponse(comment)),
            pagination: result.pagination
        };
    },

    //일정 댓글 수정 서비스
    updateComment: async (crewId, planId, commentId, requestDto) => {
        const { content } = requestDto;
        
        if (!crewId || !planId || !commentId || isNaN(crewId) || isNaN(planId) || isNaN(commentId)) {
            throw new InvalidInputValueError("유효하지 않은 파라미터입니다.", { crewId, planId, commentId });
        }
        if (!content || content.trim().length === 0) {
            throw new InvalidInputValueError("댓글 내용은 필수입니다.");
        }

        const comment = await planRepository.CrewPlanCommentRepository.updateCommentById(Number(crewId), Number(planId), Number(commentId), content);
        if (!comment) {
            throw new NotFoundPlanError("수정할 댓글이 존재하지 않습니다.", { crewId, planId, commentId });
        }

        return new planResponse.CrewPlanCommentResponse(comment);
    },

    //일정 댓글 삭제 서비스
    deleteComment: async (crewId, planId, commentId) => {
        if (!crewId || !planId || !commentId || isNaN(crewId) || isNaN(planId) || isNaN(commentId)) {
            throw new InvalidInputValueError("유효하지 않은 파라미터입니다.", { crewId, planId, commentId });
        }

        const comment = await planRepository.CrewPlanCommentRepository.deleteCommentById(Number(crewId), Number(planId), Number(commentId));
        if (!comment) {
            throw new NotFoundPlanError("삭제할 댓글이 존재하지 않습니다.", { crewId, planId, commentId });
        }

        return { message: "댓글이 성공적으로 삭제되었습니다." };
    }
}
