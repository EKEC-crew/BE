import * as baseError from "../../../../error.js";
import * as memberResponse from "../dto/response/member.response.dto.js";
import * as memberRepository from "../repository/member.repository.js";

export const readMembersByCrew = async ({ crewId, page, size }) => {
    try {
        const isExistCrew = await memberRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const memberList = await memberRepository.getMembersByCrewId({ crewId, page, size });
        return memberResponse.CrewMemberListResponse(memberList);
    } catch (err) {
        throw err;
    }
}

export const changeRoleCrewMember = async ({ crewId, crewMemberId }) => {
    try {
        const isExistCrew = await memberRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const isExistCrewMember = await memberRepository.isExistCrewMember({ crewMemberId });
        if (!isExistCrewMember) {
            throw new baseError.NotCrewMemberError("존재하지 않는 크루원입니다.", { crewMemberId })
        }
        if (isExistCrewMember.role === 2) {
            throw new Error("크루장의 멤버아이디입니다.", { crewMemberId });
        }
        const member = await memberRepository.changeRoleByCrewMemberId({ crewMemberId });
        return memberResponse.CrewMemberResponse(member);
    } catch (err) {
        throw err;
    }
}

export const kickCrewMember = async ({ crewId, crewMemberId }) => {
    try {
        const isExistCrew = await memberRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const isExistCrewMember = await memberRepository.isExistCrewMember({ crewMemberId });
        if (!isExistCrewMember) {
            throw new baseError.NotCrewMemberError("존재하지 않는 크루원입니다.", { crewMemberId })
        }
        if (isExistCrewMember.role === 2) {
            throw new Error("크루장의 멤버아이디입니다.", { crewMemberId });
        }
        const member = await memberRepository.removeMemberByCrewMemberId({ crewMemberId });
        return memberResponse.CrewMemberResponse(member);
    } catch (err) {
        throw err;
    }
}