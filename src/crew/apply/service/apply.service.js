import applyRepository from '../repository/apply.repository.js';

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
        activityList,
        styleList,
        region,
        age,
        gender,
        categoryId,
    };

    const step2Data = answers.map((a) => ({
        userId,
        recruitFormId: a.recruitFormId,
        checkedChoices: a.checkedChoices || null,
        answer: a.answer || null,
    }));

    await applyRepository.createApplicationWithTransaction(step1Data, step2Data);
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
    return await applyRepository.updateStatus(crewId, applyId, status);
};

export default {
    applyToCrew,
    getCrewApplicationById,
    updateStatus,
};
