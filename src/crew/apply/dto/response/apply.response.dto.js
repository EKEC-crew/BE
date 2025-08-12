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
        categoryId: categoryId || 0, // DB에서 null이면 클라이언트에는 0으로 반환
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
            : null, // categoryId가 null(미선택)이면 category 객체도 null
        answers: answers?.map((a) => ({
            recruitFormId: a.recruitFormId,
            checkedChoices: a.checkedChoices,
            answer: a.answer
        })) || []
    };
};

export const createCrewApplicationFormResponse = ({ step1, step2, recruitMessage }) => {
    return {
        step1: {
            gender: step1.gender,
            styles: step1.styles,
            activities: step1.activities,
            region: step1.region,
            category: step1.category || 0, // DB에서 null이면 클라이언트에는 0으로 반환
            age: step1.age
        },
        step2: step2.map((form) => ({
            id: form.id,
            question: form.question,
            questionType: form.questionType,
            choiceList: form.choiceList,
            isEtc: form.isEtc,
            required: form.required,
        })),
        recruitMessage,
    };
};