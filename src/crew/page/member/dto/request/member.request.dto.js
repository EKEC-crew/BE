export const readMemberListRequest = (crewId, page, size) => {
    return {
        crewId: Number(crewId),
        page: Number(page),
        size: Number(size),
    }
}

export const changeRoleMemberRequest = (crewId, memberId) => {
    return {
        crewId: Number(crewId),
        crewMemberId: Number(memberId),
    };
}

export const kickCrewMemberRequest = (crewId, memberId) => {
    return {
        crewId: Number(crewId),
        crewMemberId: Number(memberId),
    }
}