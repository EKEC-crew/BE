export const readCrewInfoRequest = (crewId) => {
    return {
        crewId: Number(crewId),
    };
}

export const updateCrewIntroduceRequest = (userId, crewId, body) => {
    return {
        userId: Number(userId),
        crewId: Number(crewId),
        introduction: body.introduction,
    };
}

/*
export const createCrewIntroduceRequest = (userId, crewId, body) => {
    return {
        userId: Number(userId),
        crewId: Number(crewId),
        introduction: body.introduction,
    };
}
*/