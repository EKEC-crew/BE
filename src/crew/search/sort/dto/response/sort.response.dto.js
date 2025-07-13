export const createSortedCrewResponse = (totalCount, page, limit, crews) => {
    return {
        totalCount,
        page,
        limit,
        crews: crews.map((crew) => ({
            id: crew.id,
            title: crew.title,
            content: crew.content,
            bannerImage: crew.bannerImage,
            crewCapacity: crew.crewCapacity,
            postCount: crew.postCount,
        })),
    };
};
