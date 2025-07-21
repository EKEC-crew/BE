export const createCrewPostRequest = (crewId, body) => {
    return {
        crewId: Number(crewId),
        userId: Number(body.userId),
        title: body.title,
        content: body.content,
    };
}

export const createCrewPostCommentRequest = (crewId, postId, body) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        userId: Number(body.userId),
        content: body.content,
        isPublic: body.isPublic,
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

export const readCommentListRequest = (crewId, postId) => {
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

export const updateCrewPostCommentRequest = (crewId, postId, commentId, body) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        commentId: Number(commentId),
        userId: Number(body.userId),
        content: body.content,
        isPublic: body.isPublic,
    }
}

export const deleteCrewPostRequest = (crewId, postId, body) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        userId: Number(body.userId),
    }
}

export const deleteCrewPostCommentRequest = (crewId, postId, commentId, body) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        commentId: Number(commentId),
        userId: Number(body.userId),
    }
}

export const toggleCrewPostLikeRequest = (crewId, postId, body) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        userId: Number(body.userId),
    }
}

