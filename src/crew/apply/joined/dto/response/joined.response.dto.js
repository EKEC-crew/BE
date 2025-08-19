export const crewListResponse = ({ rows }) => {
    const items = rows.map((r) => ({
        crewId: r.crew?.id ?? r.crewId,
        crewName: r.crew?.title ?? null,
    }));

    return { totalCount: items.length, items };
};