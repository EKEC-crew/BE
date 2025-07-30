import { prisma } from "../../../../db.config.js";

export const getMembersByCrewId = async ({ crewId, page, size }) => {
    try {
        const memberList = await prisma.crewMember.findMany({
            where: {
                crewId,
            },
            orderBy: {
                role: 'desc',
            },
            skip: (page - 1) * size,
            take: size,
            include: {
                user: {
                    select: {
                        nickname: true
                    }
                }
            }
        });
        return memberList;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        )
    }
}

export const changeRoleByCrewMemberId = async ({ crewMemberId }) => {
    try {
        const oldMember = await prisma.crewMember.findUnique({
            where: { id: crewMemberId }
        })
        const changedRole = oldMember.role === 0 ? 1 : 0;
        const member = await prisma.crewMember.update({
            where: { id: crewMemberId },
            data: {
                role: changedRole,
            },
            include: {
                user: {
                    select: {
                        nickname: true
                    }
                }
            }
        })
        return member;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        )
    }
}

export const removeMemberByCrewMemberId = async ({ crewMemberId }) => {
    try {
        const member = await prisma.crewMember.delete({
            where: { id: crewMemberId },
            include: {
                user: {
                    select: {
                        nickname: true
                    }
                }
            }
        })
        return member;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        )
    }
}

//비즈니스 로직 유효성 검사

export const isExistCrew = async ({ crewId }) => {
    try {
        const isExist = await prisma.crew.findUnique(
            {
                where: {
                    id: crewId,
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

export const isExistCrewMember = async ({ crewMemberId }) => {
    try {
        const isExist = await prisma.crewMember.findUnique(
            {
                where: {
                    id: crewMemberId,
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