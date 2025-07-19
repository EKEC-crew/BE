import { } from "../../../../error.js";
import * as planRepository from "../repository/plan.repository.js";
import * as planResponse from "../dto/response/plan.response.dto.js";
import * as planRequest from "../dto/request/plan.request.dto.js";

//함수이름 : 함수정의
export const CrewPlanService = {
    createPlan: async (crewId, requestDto) => {
        const req = new planRequest.CreateCrewPlanRequest(requestDto);

        if (!req.title || !req.day || typeof req.type !== 'number' || !req.content || !req.crewMemberId) {
            throw new InvalidInputValueError("필수 항목(title, day, type, content, crewMemberId)이 누락되었습니다.")
        }

        const plan = await planRepository.CrewPlanRepository.createPlan(crewId, req);
        return new planResponse.CreateCrewPlanResponse(plan);
    }
}
