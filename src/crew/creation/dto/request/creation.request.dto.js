/**
 * **[Crew Creation]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToCreateNewCrew***
 * '크루 생성'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} body
 * @param {Object} file
 * @returns {Object}
 */
export const bodyToCreateNewCrew = (body, file) => {
    return {
        name: body.crewInfo.name,
        description: body.crewInfo.description,
        maxCapacity: body.crewInfo.maxCapacity,
        bannerImage: file,
        category: body.crewInfo.category,
        activities: body.crewInfo.activities,
        styles: body.crewInfo.styles,
        region: body.crewInfo.region,
        age: body.crewInfo.age,
        gender: body.crewInfo.gender,
        recruitMessage: body.crewInfo.recruitMessage,
        applicationForm: body.applicationForm.questions,
        admin: body.crewInfo.admin,
    }
}