export const parseSortQuery = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const capacity = query.capacity ? parseInt(query.capacity) : null;
    return { page, limit, capacity };
};
