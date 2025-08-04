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
        },
        select: {
            recruitFormId: true,
            checkedChoices: true,
            answer: true,
        },
    });

    return { ...step1, answers: step2 };
};

// 지원 상태 변경
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
const findRecruitFormByCrewId = async (crewId) => {
    return await prisma.crewRecruitForm.findMany({
        where: { crewId },
        select: {
            id: true,
            question: true,
            questionType: true,
            choiceList: true,
            isEtc: true,
            required: true,
        },
        orderBy: { id: 'asc' },
    });
};


export default {
    findByUserAndCrew,
    createApplicationWithTransaction,
    findApplicationById,
    updateStatus,
    findRecruitFormByCrewId,
};
