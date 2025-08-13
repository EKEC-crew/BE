import { prisma } from '../../../db.config.js';

// 중복 지원 확인
const findByUserAndCrew = async (userId, crewId) => {
    return await prisma.crewRecruitAppliedStep1.findFirst({
        where: { userId, crewId },
    });
};

// Step1 + Step2 트랜잭션 저장
const createApplicationWithTransaction = async (step1Data, step2Data) => {
    return await prisma.$transaction([
        prisma.crewRecruitAppliedStep1.create({ data: step1Data }),
        prisma.crewRecruitAppliedStep2.createMany({ data: step2Data }),
    ]);
};

// 특정 크루 특정 지원서 조회
const findApplicationById = async (crewId, applyId) => {
    const step1 = await prisma.crewRecruitAppliedStep1.findFirst({
        where: {
            id: applyId,
            crewId: crewId,
        },
        include: {
            user: true,
            crewCategory: true,
        },
    });

    if (!step1) {
        const error = new Error('지원서를 찾을 수 없습니다.');
        error.status = 404;
        throw error;
    }

    const step2 = await prisma.crewRecruitAppliedStep2.findMany({
        where: {
            userId: step1.userId,
            crewRecruitForm: {
                crewId: crewId  // 해당 크루의 폼에 대한 답변만 조회
            }
        },
        select: {
            recruitFormId: true,
            checkedChoices: true,
            answer: true,
            crewRecruitForm: {
                select: {
                    id: true,
                    questionType: true,
                    choiceList: true,  // 선택지 리스트 (분리 위해 필요)
                    isEtc: true
                }
            }
        },
    });

    return { ...step1, answers: step2 };
};

// 지원 상태 변경 (승인 시 크루 인원수 증가 포함)
const updateStatusWithCrewCapacity = async (crewId, applyId, status) => {
    return await prisma.$transaction(async (tx) => {
        // 1. 지원서 정보 확인 (이미 승인된 상태인지 체크)
        const application = await tx.crewRecruitAppliedStep1.findFirst({
            where: {
                id: applyId,
                crewId,
            },
        });

        if (!application) {
            const error = new Error('지원서를 찾을 수 없습니다.');
            error.status = 404;
            throw error;
        }

        if (application.status === 1) {
            const error = new Error('이미 승인된 지원서입니다.');
            error.status = 400;
            throw error;
        }

        // 2. 지원서 상태 변경
        const updateResult = await tx.crewRecruitAppliedStep1.updateMany({
            where: {
                id: applyId,
                crewId,
            },
            data: {
                status,
            },
        });

        // 3. 승인 시 크루 인원수 증가 + 크루 멤버로 추가
        if (status === 1) {
            // 이미 크루 멤버인지 확인
            const existingMember = await tx.crewMember.findFirst({
                where: {
                    userId: application.userId,
                    crewId: crewId,
                },
            });

            if (existingMember) {
                const error = new Error('이미 크루 멤버입니다.');
                error.status = 400;
                throw error;
            }

            // 크루 인원수 증가
            await tx.crew.update({
                where: {
                    id: crewId,
                },
                data: {
                    crewCapacity: {
                        increment: 1,
                    },
                },
            });

            // 크루원으로 추가
            await tx.crewMember.create({
                data: {
                    userId: application.userId,
                    crewId: crewId,
                    role: 0,
                },
            });
        }

        return updateResult;
    });
};

// 지원 상태 변경 (기본)
const updateStatus = async (crewId, applyId, status) => {
    return await prisma.crewRecruitAppliedStep1.updateMany({
        where: {
            id: applyId,
            crewId,
        },
        data: {
            status,
        },
    });
};

// 특정 크루 지원서 폼 조회
const findCrewApplicationFormById = async (crewId) => {
    const crew = await prisma.crew.findUnique({
        where: { id: crewId },
        select: {
            genderLimit: true,
            ageLimit: true,
            recruitMessage: true,
            title: true,
            userId: true,
            regionId: true,
            content: true,
            categoryId: true,
            crewCapacity: true,
            crewActivity: { select: { activityId: true } },
            crewStyle: { select: { styleId: true } },
            crewRecruitForm: {
                select: {
                    id: true,
                    question: true,
                    questionType: true,
                    choiceList: true,
                    isEtc: true,
                    required: true,
                },
                orderBy: { id: 'asc' },
            },
        },
    });

    if (!crew) {
        const error = new Error("해당 크루를 찾을 수 없습니다.");
        error.status = 404;
        throw error;
    }

    return {
        step1: {
            gender: crew.genderLimit,
            styles: crew.crewStyle.map((s) => s.styleId),
            name: crew.title,
            activities: crew.crewActivity.map((a) => a.activityId),
            admin: crew.userId,
            region: crew.regionId,
            description: crew.content,
            category: crew.categoryId,
            maxCapacity: crew.maxCapacity,
            age: crew.ageLimit
        },
        step2: crew.crewRecruitForm,
        recruitMessage: crew.recruitMessage,
    };
};

export default {
    findByUserAndCrew,
    createApplicationWithTransaction,
    findApplicationById,
    updateStatus,
    updateStatusWithCrewCapacity,
    findCrewApplicationFormById,
};