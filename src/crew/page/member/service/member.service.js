import * as baseError from "../../../../error.js";
import * as memberResponse from "../dto/response/member.response.dto.js";
import * as memberRepository from "../repository/member.repository.js";

export const readMembersByCrew = async ({ userId, crewId, page, size }) => {
    try {
        const isExistCrew = await memberRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const crewMember = await memberRepository.findCrewMember({
            userId,
            crewId,
        })
        if (!crewMember) {
            throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
        }
        const data = await memberRepository.getMembersByCrewId({ crewId, page, size });
        const members = data.members;
        const totalElements = data.totalElements;
        const totalPages = data.totalPages;
        const hasNext = data.hasNext;
        const pageNum = data.pageNum;
        const pageSize = data.pageSize;
        return memberResponse.CrewMemberListResponse({ members, totalElements, totalPages, hasNext, pageNum, pageSize });
    } catch (err) {
        throw err;
    }
}

export const changeRoleCrewMember = async ({ userId, crewId, crewMemberId }) => {
    try {
        const isExistCrew = await memberRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const crewMember = await memberRepository.findCrewMember({
            userId,
            crewId,
        })
        if (!crewMember) {
            throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저의 요청입니다.", { userId });
        }
        if (crewMember.role !== 2) {
            throw new baseError.PermissionDeniedError("권한이 없는 크루원입니다.");
        }
        const isExistCrewMember = await memberRepository.isExistCrewMember({ crewMemberId });
        if (!isExistCrewMember) {
            throw new baseError.NotCrewMemberError("존재하지 않는 크루원입니다.", { crewMemberId })
        }
        if (isExistCrewMember.crewId !== crewId) {
            throw new baseError.NotBelongToCrewError("해당 크루에 속하지 않은 멤버입니다.", { crewMemberId });
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

export const kickCrewMember = async ({ userId, crewId, crewMemberId }) => {
    try {
        const isExistCrew = await memberRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const crewMember = await memberRepository.findCrewMember({
            userId,
            crewId,
        })
        if (!crewMember) {
            throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저의 요청입니다.", { userId });
        }
        if (crewMember.role === 0) {
            throw new baseError.PermissionDeniedError("권한이 없는 크루원입니다.");
        }
        const isExistCrewMember = await memberRepository.isExistCrewMember({ crewMemberId });
        if (!isExistCrewMember) {
            throw new baseError.NotCrewMemberError("존재하지 않는 크루원입니다.", { crewMemberId })
        }
        if (isExistCrewMember.crewId !== crewId) {
            throw new baseError.NotBelongToCrewError("해당 크루에 속하지 않은 멤버입니다.", { crewMemberId });
        }
        if (isExistCrewMember.role === 2) {
            throw new Error("크루장의 멤버아이디입니다.", { crewMemberId });
        }
        if (crewMember.role === 1 && isExistCrewMember.role === 1) {
            throw new baseError.PermissionDeniedError("권한이 없는 크루원입니다.");
        }
        const member = await memberRepository.removeMemberByCrewMemberId({ crewMemberId });
        return memberResponse.CrewMemberResponse(member);
    } catch (err) {
        throw err;
    }
}

export const addCrewMember = async ({ crewId, userId }) => {
    try {
        const isExistCrew = await memberRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const crewMember = await memberRepository.findCrewMember({
            userId,
            crewId,
        })
        if (crewMember) {
            throw new baseError.NotCrewMemberError("이미 해당 크루에 속해있습니다.", { userId });
        }
        const member = await memberRepository.addCrewMember({ userId, crewId });
        const memberId = member.id;
        const role = member.role;

        return { userId, crewId, memberId, role };
    } catch (err) {
        throw err;
    }
}