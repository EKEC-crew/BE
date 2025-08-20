export const createCrewPostRequest = (userId, crewId, body, files) => {
    return {
        crewId: Number(crewId),
        userId: Number(userId),
        title: body.title,
        content: body.content,
        images: files,
    };
}

export const createCrewPostCommentRequest = (userId, crewId, postId, body) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        userId: Number(userId),
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

export const readPostRequest = (userId, crewId, postId) => {
    return {
        userId: Number(userId),
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

export const updateCrewPostRequest = (userId, crewId, postId, body, files) => {

    let existingImageIds = [];

    if (typeof body.existingImageIds === 'string') {
        existingImageIds = body.existingImageIds
            .split(',')
            .map(id => id.trim())
            .filter(id => id !== '')
            .map(Number);
    } else if (Array.isArray(body.existingImageIds)) {
        existingImageIds = body.existingImageIds.map(Number);
    }

    return {
        crewId: Number(crewId),
        postId: Number(postId),
        userId: Number(userId),
        title: body.title,
        content: body.content,
        images: files,
        existingImageIds: existingImageIds,
    }
}

export const updateCrewPostCommentRequest = (userId, crewId, postId, commentId, body) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        commentId: Number(commentId),
        userId: Number(userId),
        content: body.content,
        isPublic: body.isPublic,
    }
}

export const deleteCrewPostRequest = (userId, crewId, postId) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        userId: Number(userId),
    }
}

export const deleteCrewPostCommentRequest = (userId, crewId, postId, commentId) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        commentId: Number(commentId),
        userId: Number(userId),
    }
}

export const toggleCrewPostLikeRequest = (userId, crewId, postId) => {
    return {
        crewId: Number(crewId),
        postId: Number(postId),
        userId: Number(userId),
    }
}

