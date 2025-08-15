const ROLE_LABEL = {
    0: '크루원',
    1: '운영진',
    2: '크루장',
};

export const buildMyCrewsResponse = ({ rows }) => {
    const items = rows.map((r) => ({
        crewId: r.crew?.id,
        crewName: r.crew?.title,
        crewImage: r.crew?.bannerImage,
        crewContent: r.crew?.content,
        categoryId: r.crew?.crewCategory?.id,
        categoryName: r.crew?.crewCategory?.content,
        role: r.role,
        roleLabel: ROLE_LABEL[r.role] ?? '크루원',
        crewCreatedAt: r.crew?.createdAt, // 크루가 생성된 날짜
    }));

    return { totalCount: items.length, items };
};