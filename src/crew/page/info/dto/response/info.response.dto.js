export const ReadCrewInfoResponse = (crew) => {
    const response = {
        crewId: crew.id,
        title: crew.title,
        content: crew.content,
        score: crew.score,
        crewCapacity: crew.crewCapacity,
        maxCapacity: crew.maxCapacity,
        bannerImage: crew.bannerImage,
        nickname: crew.user.nickname,
        profileImage: crew.user.image,
        category: crew.crewCategory.content,
        introduction: crew.introduction,
    }

    return response;
}

export const UpdateCrewIntroduceResponse = (crew) => {
    const response = {
        crewId: crew.id,
        introduction: crew.introduction,
    }

    return response;
}

/*
export const CreateCrewIntroduceResponse = (crew) => {

}
*/