import sortRepository from '../repository/sort.repository.js';
import { UnsupportedSortTypeError } from "../../../../error.js";

const getSortedCrews = async (path, page, limit, capacity) => {
    const skip = (page - 1) * limit;
    const orderBy = getOrderByFromPath(path);
    const filter = {};
    if (capacity !== null) {
        filter.crewCapacity = { gte: capacity };
    }

    const { totalCount, crews } = await sortRepository.findCrewsBySort(orderBy, filter, skip, limit);

    return { totalCount, crews };
};

const getOrderByFromPath = (path) => {
    switch (path) {
        case '/latest':
            return { createdAt: 'desc' };
        case '/popular':
            return { postCount: 'desc' };
        case '/member/asc':
            return { crewCapacity: 'asc' };
        case '/member/desc':
            return { crewCapacity: 'desc' };
        default:
            throw new UnsupportedSortTypeError(undefined, { path });
    }
};

export default {
    getSortedCrews,
};
