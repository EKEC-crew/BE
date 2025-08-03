export class ApplySuccessResponseDTO {
    constructor(message) {
        this.resultType = 'SUCCESS';
        this.error = null;
        this.success = {
            message,
        };
    }
}

export class ApplyErrorResponseDTO {
    constructor(message, code = 400) {
        this.resultType = 'FAIL';
        this.error = {
            message,
            code,
        };
        this.success = null;
    }
}

export const createCrewApplicationDetailResponse = (application) => {
    const {
        id,
        region,
        age,
        gender,
        crewId,
        userId,
        categoryId,
        activityList,
        styleList,
        user,
        crewCategory,
        answers
    } = application;

    return {
        id,
        region,
        age,
        gender,
        crewId,
        userId,
        categoryId,
        activityList,
        styleList,
        user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email
            }
            : null,
        category: crewCategory
            ? {
                id: crewCategory.id,
                content: crewCategory.content
            }
            : null,
        answers: answers?.map((a) => ({
            recruitFormId: a.recruitFormId,
            checkedChoices: a.checkedChoices,
            answer: a.answer
        })) || []
    };
};

export const createCrewRecruitFormResponse = (forms) => {
    return forms.map((form) => ({
        id: form.id,
        question: form.question,
        questionType: form.questionType,
        choiceList: form.choiceList,
        isEtc: form.isEtc,
        required: form.required,
    }));
};
