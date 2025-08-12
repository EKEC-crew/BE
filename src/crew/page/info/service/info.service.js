import * as baseError from "../../../../error.js";
import * as infoRepository from "../repository/info.repository.js";
import * as infoResponse from "../dto/response/info.response.dto.js";

export const readCrewInfo = async ({ crewId }) => {
    try {
        const isExistCrew = await infoRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const memberCount = await infoRepository.countMember({ crewId });
        const crew = isExistCrew;
        return infoResponse.ReadCrewInfoResponse({ crew, memberCount });
    } catch (err) {
        throw err;
    }
}

export const updateCrewIntroduce = async ({ userId, crewId, introduction }) => {
    try {
        const isExistCrew = await infoRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const crewMember = await infoRepository.findCrewMember({
            userId,
            crewId,
        })
        if (!crewMember) {
            throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
        }
        if (crewMember.role !== 2) {
            throw new baseError.PermissionDeniedError("권한이 없는 유저입니다.", { userId });
        }
        const crew = await infoRepository.updateCrewIntroduce({
            crewId,
            introduction,
        })
        return infoResponse.UpdateCrewIntroduceResponse(crew);
    } catch (err) {
        throw err;
    }
}

/*
export const createCrewIntroduce = async ({ userId, crewId, introduction }) => {
    try {
        const isExistCrew = await infoRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const crewMember = await infoRepository.findCrewMember({
            userId,
            crewId,
        })
        if (!crewMember) {
            throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
        }
        if (crewMember.role !== 2) {
            throw new baseError.PermissionDeniedError("권한이 없는 유저입니다.", { userId });
        }
        const crewIntroduction = await infoRepository.createCrewIntroduce({
            crewId,
            introduction,
        })
        return infoResponse.CreateCrewIntroduceResponse(crewIntroduction);
    } catch (err) {
        throw new Error(
            `서비스 단계에서 오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        )
    }
}
*/