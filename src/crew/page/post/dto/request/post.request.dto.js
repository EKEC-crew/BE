export const createCrewPostRequest = (userId, crewId, body) => {
    return {
        userId: Number(userId),
        crewId: Number(crewId),
        title: body.title,
        content: body.content,
    };
}

export const updateCrewPostRequest = (userId, crewId, postId, body) => {
    return {
        userId: Number(userId),
        crewId: Number(crewId),
        postId: Number(postId),
        title: body.title,
        content: body.content,
    }
}

export const createCrewPostCommentRequest = (body) => {
    return {
        content: body.content,
    }
}

export const updateCrewPostCommentRequest = (body) => {
    return {
        content: body.content,
    }
}

export const useCrewIdRequest = (crewId) => {
    return {
        crewId: Number(crewId),
    }
}

export const useCrewAndPostIdRequest = (crewId, postId) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
    }
}