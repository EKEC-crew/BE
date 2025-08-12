import { prisma } from '../../../../db.config.js';

const findCrewMember = async (crewId) => {
    return prisma.crewMember.findFirst({
        where: {
            // userId,
            crewId,
        },
    });
};

const getApplicantsByCrewId = async (crewId) => {
    return prisma.crewRecruitAppliedStep1.findMany({
        where: { crewId },
        include: {
            user: {
                select: {
                    nickname: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export default { findCrewMember, getApplicantsByCrewId };
