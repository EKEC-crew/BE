import { prisma } from '../../../../db.config.js';

const getMyJoined = async ({ userId }) => {
    const rows = await prisma.crewMember.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            crewId: true,
            crew: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });

    return rows;
};

export default { getMyJoined };