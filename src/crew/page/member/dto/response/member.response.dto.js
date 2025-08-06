export const CrewMemberListResponse = ({ members, userRole, totalElements, totalPages, hasNext, pageNum, pageSize }) => {
    const items = members.map(member => ({
        memberId: member.id,
        nickname: member.user?.nickname,
        role: member.role,
    }))
    const response = {
        members: items,
        userRole: userRole,
        totalElements: totalElements,
        totalPages: totalPages,
        hasNext: hasNext,
        pageNum: pageNum,
        pageSize: pageSize,
    }

    return response;
}

export const CrewMemberResponse = (body) => {
    const member = body;

    const response = {
        memberId: member.id,
        nickname: member.user?.nickname,
        role: member.role,
    }

    return response;
}

export const AddCrewMemberResponse = ({ userId, crewId, memberId, role }) => {
    const response = {
        userId: userId,
        crewId: crewId,
        memberId: memberId,
        role: role
    }
    return response;
}