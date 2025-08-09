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
    findCrewApplicationFormById,
};
