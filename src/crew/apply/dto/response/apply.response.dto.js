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
        categoryId: categoryId || 0,
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
        answers: answers?.map((a) => {
            const form = a.crewRecruitForm;
            let etcChoices = [];

            // 체크박스 문항이고 선택된 답변이 있는 경우
            if (a.checkedChoices && form?.questionType === 0) {
                const predefinedList = form.choiceList || [];

                a.checkedChoices.forEach(choice => {
                    if (!predefinedList.includes(choice)) {
                        etcChoices.push(choice);  // 기타로 입력한 답변만 추출
                    }
                });
            }

            return {
                recruitFormId: a.recruitFormId,
                questionType: form?.questionType || 0,
                // 체크박스 문항인 경우 기타 답변만 제공
                etcChoices: form?.questionType === 0 ? etcChoices : null,
                // 기존 checkedChoices 유지 (전체 답변)
                checkedChoices: a.checkedChoices,
                answer: a.answer
            };
        }) || []
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