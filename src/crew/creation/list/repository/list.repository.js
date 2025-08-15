import { prisma } from '../../../../db.config.js';

const findMyCrews = async ({ userId }) => {
    const where = {
        userId,
        role: { in: [1, 2] } // 운영진 또는 크루장
    };

    const rows = await prisma.crewMember.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            role: true,
            createdAt: true,
            crew: {
                select: {
                    id: true,
                    title: true,          // 크루명
                    bannerImage: true,    // 크루 이미지
                    content: true,        // 크루 소개
                    createdAt: true,      // 크루 생성일
                    crewCategory: {       // 크루 카테고리
                        select: {
                            id: true,
                            content: true,    // 카테고리명
                        },
                    },
                },
            },
        },
    });

    return rows;
};

export default { findMyCrews };