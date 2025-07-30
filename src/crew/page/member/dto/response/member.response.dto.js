export const CrewMemberListResponse = (body) => {
    const response = body.map(member => ({
        memberId: member.id,
        nickname: member.user?.nickname,
        role: member.role,
    }))

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