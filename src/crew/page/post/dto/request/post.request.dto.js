export const createCrewPostRequest = (body) => {
    return{
      title: body.title,
      content: body.content,
    };
}

export const updateCrewPostRequest = (body) => {
    return{
        title:body.title,
        content: body.content,
    }
}

export const createCrewPostCommentRequest = (body) => {
    return{
        content: body.content,
    }
}

export const updateCrewPostCommentRequest = (body) => {
    return{
        content: body.content,
    }
}