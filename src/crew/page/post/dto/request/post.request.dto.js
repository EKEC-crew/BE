export const createCrewPostRequest = (crewId, body) => {
    return {
        crewId: Number(crewId),
        userId: Number(body.userId),
        title: body.title,
        content: body.content,
    };
}

export const createCrewPostCommentRequest = (body) => {
    return {
        content: body.content,
    }
}

export const readPostListRequest = (crewId) => {
    return {
        crewId: Number(crewId),
    }
}

export const readPostRequest = (crewId, postId) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
    }
}

export const updateCrewPostRequest = (crewId, postId, body) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        userId: Number(body.userId),
        title: body.title,
        content: body.content,
    }
}

export const updateCrewPostCommentRequest = (body) => {
    return {
        content: body.content,
    }
}

export const deleteCrewPostRequest = (crewId, postId, body) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        userId: Number(body.userId),
    }
}