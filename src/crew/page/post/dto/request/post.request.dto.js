export const createCrewPostRequest = (crewId, body, files) => {
    return {
        crewId: Number(crewId),
        userId: Number(body.userId),
        title: body.title,
        content: body.content,
        images: files,
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

export const readPostListRequest = (crewId, page, size) => {
    return {
        crewId: Number(crewId),
        page: Number(page),
        size: Number(size),
    }
}

export const readPostRequest = (crewId, postId) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
    }
}

export const readCommentListRequest = (crewId, postId, page, size) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        page: Number(page),
        size: Number(size),
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

