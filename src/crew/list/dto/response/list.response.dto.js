export function mapCrewToResponse(crew) {
    // region이 null인 경우 서울 전지역(ID: 148) 기본값 사용
    const regionSido = crew.region?.sido || "서울";
    const regionGu = crew.region?.goo || "전지역";

    return {
        id: crew.id,
        title: crew.title,
        content: crew.content,
        crewCategory: crew.crewCategory.content,
        regionSido: regionSido,
        regionGu: regionGu,
        bannerImage: crew.bannerImage,
        postCount: crew.postCount,
        createdAt: crew.createdAt,
        crewActivity: crew.crewActivity.map(({ activity }) => activity.content),
        crewStyle: crew.crewStyle.map(({ style }) => style.content)
    };
}