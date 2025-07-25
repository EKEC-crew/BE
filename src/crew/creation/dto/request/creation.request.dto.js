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