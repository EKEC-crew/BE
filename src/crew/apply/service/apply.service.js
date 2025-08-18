import applyRepository from '../repository/apply.repository.js';
import { eventEmitter } from '../../../index.js';
import { prisma } from '../../../db.config.js';

const applyToCrew = async (dto) => {
    const {
        userId,
        crewId,
        activityList,
        styleList,
        region,
        age,
        gender,
        categoryId,
        answers,
    } = dto;

    const existing = await applyRepository.findByUserAndCrew(userId, crewId);
    if (existing) {
        const error = new Error('이미 이 크루에 지원한 이력이 있습니다.');
        error.status = 400;
        throw error;
    }

    const step1Data = {
        userId,
        crewId,
        activityList: Array.isArray(activityList) ? activityList : [],
        styleList: Array.isArray(styleList) ? styleList : [],
        region: Number.isInteger(region) ? region : 0,
        age: Number.isInteger(age) ? age : 0,
        gender: Number.isInteger(gender) ? gender : 0,
        categoryId: Number.isInteger(categoryId) && categoryId !== 0 ? categoryId : null,
    };

    const step2Data = answers.map((a) => ({
        userId,
        recruitFormId: a.recruitFormId,
        checkedChoices: a.checkedChoices || null,
        answer: a.answer || null,
    }));

    // 지원서 생성
    await applyRepository.createApplicationWithTransaction(step1Data, step2Data);

    // 크루장에게 가입 요청 알람 이벤트 발생
    const crew = await prisma.crew.findUnique({
        where: { id: crewId },
        select: { userId: true }
    });

    if (crew) {
        eventEmitter.emit('CREW_JOIN_REQUEST', {
            targetId: { userId, crewId }, // 지원자 정보
            userId: [crew.userId]  // 크루장이 알람을 받음
        });
    }
};

const getCrewApplicationById = async (crewId, applyId) => {
    const application = await applyRepository.findApplicationById(crewId, applyId);
    if (!application) {
        const error = new Error('지원서를 찾을 수 없습니다.');
        error.status = 404;
        throw error;
    }

    return application;
};

const updateStatus = async (crewId, applyId, status) => {
    // 지원서 정보 조회
    const application = await applyRepository.findApplicationById(crewId, applyId);

    // 크루장 정보 조회
    const crew = await prisma.crew.findUnique({
        where: { id: crewId },
        select: { userId: true }
    });

    // 상태 변경 전에 먼저 알람 발송
    if (status === 1) {
        eventEmitter.emit('CREW_JOIN_ACCEPTED', {
            targetId: { userId: crew.userId, crewId }, // 크루장 정보
            userId: [application.userId] // 지원자가 알람을 받음
        });
    } else if (status === 2) {
        eventEmitter.emit('CREW_JOIN_REJECTED', {
            targetId: { userId: crew.userId, crewId }, // 크루장 정보
            userId: [application.userId] // 지원자가 알람을 받음
        });
    }

    // 상태 변경
    if (status === 1) {
        return await applyRepository.updateStatusWithCrewCapacity(crewId, applyId, status);
    } else {
        return await applyRepository.updateStatus(crewId, applyId, status);
    }
};

const getRecruitFormByCrewId = async (crewId) => {
    return await applyRepository.findCrewApplicationFormById(crewId);
};

export default {
    applyToCrew,
    getCrewApplicationById,
    updateStatus,
    getRecruitFormByCrewId,
};