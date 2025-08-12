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
        // categoryId가 null, undefined, 또는 0이면 0으로 저장
        this.categoryId = (categoryId == null || categoryId === 0) ? 0 : categoryId;
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
        // categoryId가 null, undefined, 또는 0이면 0으로 저장
        this.categoryId = (body.categoryId == null || body.categoryId === 0) ? 0 : body.categoryId;
        this.answers = body.answers;
    }

    isValid() {
        return (
            Number.isInteger(this.userId) &&
            Array.isArray(this.activityList) &&
            Array.isArray(this.styleList) &&
            Number.isInteger(this.categoryId)
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