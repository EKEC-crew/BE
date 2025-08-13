// 숫자 status → 라벨 (요구사항: 0(대기중)만 조회)
const STATUS_LABEL = {
    0: '미승인',   // 대기중
    1: '승인',
    2: '거절',
};

export const buildListResponse = ({ rows }) => {
    const items = rows.map((r) => ({
        applyId: r.id,
        crewId: r.crew?.id ?? r.crewId,
        crewName: r.crew?.title ?? null,
        crewImage: r.crew?.bannerImage ?? null,
        crewContent: r.crew?.content ?? null,
        status: r.status,                         // 0
        statusLabel: STATUS_LABEL[r.status] ?? '미승인',
        appliedAt: r.createdAt,
    }));

    return { totalCount: items.length, items };
};