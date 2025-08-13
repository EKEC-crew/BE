import { prisma } from '../../../../db.config.js';

const findMyPendingApplies = async ({ userId }) => {
    const where = { userId, status: 0 };

    const rows = await prisma.crewRecruitAppliedStep1.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,                 // applyId 필요시 사용
            status: true,             // 항상 0
            createdAt: true,
            crewId: true,
            crew: {
                select: {
                    id: true,
                    title: true,          // 크루명
                    bannerImage: true,    // 크루 이미지
                    content: true,        // 크루 소개
                },
            },
        },
    });

    return rows;
};

export default { findMyPendingApplies };