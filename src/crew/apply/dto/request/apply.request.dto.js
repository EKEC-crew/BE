export class ApplyStep2AnswerDTO {
    constructor({ recruitFormId, checkedChoices, answer }) {
        this.recruitFormId = recruitFormId;
        this.checkedChoices = checkedChoices || null;
        this.answer = answer || null;
    }
}

export class ApplyRequestDTO {
    constructor({
        userId,
        activityList,
        styleList,
        region,
        age,
        gender,
        categoryId,
        crewId,
        answers,
    }) {
        this.userId = userId;
        this.crewId = crewId;
        this.activityList = activityList;
        this.styleList = styleList;
        this.region = region;
        this.age = age;
        this.gender = gender;
        this.categoryId = categoryId;
        this.answers = Array.isArray(answers)
            ? answers.map((a) => new ApplyStep2AnswerDTO(a))
            : [];
    }
}