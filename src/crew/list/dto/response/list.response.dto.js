export function mapCrewToResponse(crew) {
    return {
        id: crew.id,
        title: crew.title,
        content: crew.content,
        crewCategory: crew.crewCategory.content,
        regionSido: crew.region.sido,
        regionGu: crew.region.goo,
        bannerImage: crew.bannerImage,
        postCount: crew.postCount,
        createdAt: crew.createdAt,
        crewActivity: crew.crewActivity.map(({ activity }) => activity.content),
        crewStyle: crew.crewStyle.map(({ style }) => style.content)
    };
}
