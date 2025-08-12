import { prisma } from "../../../../db.config.js";
/*
export const createCrewIntroduce = async ({ crewId, introduction }) => {
    try {
        const crew = await prisma.crew.create({
            where: { id: crewId },
            select: { introduction: true }
        })
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        )
    }
}
*/

export const countMember = async ({ crewId }) => {
    try {
        const memberCount = await prisma.crewMember.count({
            where: { crewId: crewId }
        });
        return memberCount;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        )
    }
}
export const updateCrewIntroduce = async ({ crewId, introduction }) => {
    try {
        const crew = await prisma.crew.update({
            where: { id: crewId },
            data: {
                introduction: introduction,
            },
            select: { id: true, introduction: true }
        });
        return crew;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        )
    }
}

// 유저 아이디로 크루멤버아이디 찾기(인증)
export const findCrewMember = async ({ userId, crewId }) => {
    try {
        const crewMember = await prisma.crewMember.findFirst(
            {
                where: {
                    userId: userId,
                    crewId: crewId,
                }
            }
        )
        return crewMember;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        )
    }
}

// 비즈니스 유효성 검사

export const isExistCrew = async ({ crewId }) => {
    try {
        const isExist = await prisma.crew.findUnique(
            {
                where: {
                    id: crewId,
                },
                include: {
                    user: {
                        select: {
                            nickname: true,
                            image: true,
                        }
                    },
                    crewCategory: {
                        select: {
                            content: true,
                        }
                    }
                }
            }
        )

        return isExist;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        )
    }
}