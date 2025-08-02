import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
        prisma.crewRecruitAppliedStep2.createMany({
            data: step2Data,
        }),
    ]);
};

export default {
    findByUserAndCrew,
    createApplicationWithTransaction,
};
