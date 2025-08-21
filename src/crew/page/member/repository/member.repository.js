import { prisma } from "../../../../db.config.js";

export const getMembersByCrewId = async ({ crewId, page, size }) => {
    try {
        const members = await prisma.crewMember.findMany({
            where: {
                crewId,
            },
            orderBy: {
                role: 'desc',
            },
            skip: (page - 1) * size,
            take: size + 1,
            include: {
                user: {
                    select: {
                        nickname: true
                    }
                }
            }
        });
        const totalElements = await prisma.crewMember.count({
            where: { crewId }
        });
        const totalPages = Math.ceil(totalElements / size);
        const hasNext = members.length > size;
        const pageNum = page;
        const pageSize = members.length;
        return { members, totalElements, totalPages, hasNext, pageNum, pageSize };
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

export const addCrewMember = async ({ userId, crewId }) => {
    try {
        const member = await prisma.crewMember.create({
            data: {
                userId: userId,
                crewId: crewId,
                role: 0
            }
        })
        return member;
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
                },
                include: {
                    user: {
                        select: {
                            id: true
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