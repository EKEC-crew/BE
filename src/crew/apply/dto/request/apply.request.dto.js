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

export class CrewApplyRequestDto {
    constructor(body) {
        this.userId = body.userId;
        this.activityList = body.activityList;
        this.styleList = body.styleList;
        this.region = body.region;
        this.age = body.age;
        this.gender = body.gender;
        this.categoryId = body.categoryId;
        this.answers = body.answers;
    }

    isValid() {
        return (
            Number.isInteger(this.userId) &&
            Array.isArray(this.activityList) &&
            Array.isArray(this.styleList)
        );
    }
}

export class UpdateApplyStatusDto {
    constructor(body) {
        this.status = body.status;
    }

    isValid() {
        return [1, 2].includes(this.status);
    }
}
