import { prisma } from "../../../../db.config.js";

const findCrewsBySort = async (orderBy, where, skip, limit) => {
    const [totalCount, crews] = await Promise.all([
        prisma.crew.count({ where }),
        prisma.crew.findMany({
            skip,
            take: limit,
            orderBy,
            where,
            select: {
                id: true,
                title: true,
                content: true,
                bannerImage: true,
                crewCapacity: true,
                postCount: true
            }
        })
    ]);

    return { totalCount, crews };
};

export default {
    findCrewsBySort
};
