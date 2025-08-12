import { prisma } from "../../../db.config.js";

async function getPopularCrews() {
    return await prisma.crew.findMany({
        take: 20,
        orderBy: { postCount: 'desc' },
        select: {
            id: true,
            title: true,
            content: true,
            bannerImage: true,
            postCount: true,
            createdAt: true,
            crewCategory: {
                select: { content: true }
            },
            region: {
                select: { sido: true, goo: true }
            },
            crewActivity: {
                select: {
                    activity: {
                        select: { content: true }
                    }
                }
            },
            crewStyle: {
                select: {
                    style: {
                        select: { content: true }
                    }
                }
            }
        }
    });
}


async function getLatestCrews() {
    return await prisma.crew.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            content: true,
            bannerImage: true,
            postCount: true,
            createdAt: true,
            crewCategory: {
                select: { content: true }
            },
            region: {
                select: { sido: true, goo: true }
            },
            crewActivity: {
                select: {
                    activity: {
                        select: { content: true }
                    }
                }
            },
            crewStyle: {
                select: {
                    style: {
                        select: { content: true }
                    }
                }
            }
        }
    });
}

export { getPopularCrews, getLatestCrews };