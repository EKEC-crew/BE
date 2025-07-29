import { prisma } from "../../../../db.config.js";
import { InvalidInputValueError } from "../../../../error.js";

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

        const crew = await prisma.crew.findUnique({ where: { id: crewId } });
        if (!crew) {
            throw new InvalidInputValueError("존재하지 않는 crewId입니다.", { crewId });
        }

        const plan = await planRepository.CrewPlanRepository.createPlan(crewId, req);
        return new planResponse.CreateCrewPlanResponse(plan);
    },

    //특정 일정 조회 서비스
    getPlanById: async (crewId, planId) => {
        if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
            throw new InvalidInputValueError("crewId 또는 planId가 올바르지 않습니다.", {crewId, planId});
        }

        const plan = await planRepository.CrewPlanRepository.findPlanById(crewId, planId);

        if (!plan) {
            throw new NotFoundPlanError("해당 일정이 존재하지 않습니다.", {crewId, planId});
        }
        
        return new planResponse.GetCrewPlanResponse(plan);
    },

    //일정 리스트로 조회 서비스
    getPlanListByCrewId: async (crewId) => {
        if (!crewId || isNaN(crewId)) {
            throw new InvalidInputValueError("crewId가 올바르지 않습니다.", {crewId});
    }

    const crew = await prisma.crew.findUnique({ where: {id: crewId} });
    if (!crew) {
        throw new InvalidInputValueError("존재하지 않는 crewId입니다.", {crewId});
    }

    const plans = await planRepository.CrewPlanRepository.findPlanListByCrewId(crewId);
    
    return plans.map((plan) => new planResponse.GetCrewPlanResponse(plan));
    },

    //일정 수정 서비스
    updatePlanById: async (crewId, planId, requestDto) => {
        const req = new planRequest.UpdateCrewPlanRequest(requestDto);
        if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
            throw new InvalidInputValueError("crewId 또는 planId가 올바르지 않습니다.", {crewId, planId});
        }
        const crew= await prisma.crew.findUnique({ where: {id: crewId} });
        
        if (!crew) {
            throw new InvalidInputValueError("존재하지 않는 crewId입니다.", {crewId});
        }
        const plan = await planRepository.CrewPlanRepository.findPlanById(crewId, planId);
        if (!plan) {
            throw new NotFoundPlanError("해당 일정이 존재하지 않습니다.", {crewId, planId});
        }

        const updatedPlan = await planRepository.CrewPlanRepository.updatePlanById(crewId, planId, req);
        return new planResponse.GetCrewPlanResponse(updatedPlan);
    },
    
    //일정 삭제 서비스
    deletePlan: async (crewId, planId) => {
        if (!crewId || !planId || isNaN(crewId) || isNaN(planId)) {
            throw new InvalidInputValueError("유효하지 않은 crewId 또는 planId입니다.", {crewId, planId});
          }
      
          const deleted = await planRepository.CrewPlanRepository.deletePlanByCrewAndId(crewId, planId);
          if (!deleted) {
            throw new InvalidInputValueError("삭제할 일정이 존재하지 않습니다.", { crewId, planId });
          }

        const deletedPlan = await planRepository.CrewPlanRepository.deletePlanById(crewId, planId);
        if (!deletedPlan) {
            throw new InvalidInputValueError("삭제할 일정이 존재하지 않습니다.", { crewId, planId });
        }
    }
}

export const CrewPlanCommentService = {

    //일정 댓글 생성 서비스
    createComment: async (crewId, planId, requestDto) => {
        const {crewMemberId, content} = requestDto;
        
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
        const plan = await planRepository.CrewPlanRepository.findPlanById(crewId, planId);
        if (!plan) {
            throw new InvalidInputValueError("해당 크루 일정이 존재하지 않습니다.", {crewId, planId});
        }

        const comment = await planRepository.CrewPlanCommentRepository.createComment(crewId, planId, crewMemberId, content);
        return new planResponse.CrewPlanCommentResponse(comment);
    }

    //일장 댓글 단건 조회 서비스
    


}
