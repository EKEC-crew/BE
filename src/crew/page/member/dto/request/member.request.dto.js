export const readMemberListRequest = (userId, crewId, page, size) => {
    return {
        userId: Number(userId),
        crewId: Number(crewId),
        page: Number(page),
        size: Number(size),
    }
}

export const changeRoleMemberRequest = (userId, crewId, memberId) => {
    return {
        userId: Number(userId),
        crewId: Number(crewId),
        crewMemberId: Number(memberId),
    };
}

export const kickCrewMemberRequest = (userId, crewId, memberId) => {
    return {
        userId: Number(userId),
        crewId: Number(crewId),
        crewMemberId: Number(memberId),
    }
}

//개발용
export const addCrewMemberRequest = (crewId, body) => {
    return {
        crewId: Number(crewId),
        userId: Number(body.userId),
    };
}