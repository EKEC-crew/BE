export const ReadCrewInfoResponse = ({ crew, memberCount }) => {
    const response = {
        crewId: crew.id,
        title: crew.title,
        content: crew.content,
        score: crew.score,
        memberCount: memberCount,
        crewCapacity: crew.crewCapacity,
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