import {prisma} from "../../../db.config.js";

export const createCrew = async (body) => {
    const crew = await prisma.crew.create({
        data: {
            title: body.name,
            content: body.description,
            introduction: "",
            crewCapacity: body.maxCapacity,
            ageLimit: body.age,
            genderLimit: body.gender,
            recruitMessage: body.recruitMessage,
            score: 0,
            user: {
                connect: {
                    id: body.admin
                }
            },
            crewCategory: {
                connect: {
                    id: body.category
                }
            },
            region: {
                connect: {
                    id: body.region
                }
            }
        }
    });
    const activityData = body.activities.map((activity) => {
        return {
            crewId: crew.id,
            activityId: activity,
        }
    });
    await prisma.crewActivity.createMany({
        data: activityData
    });
    const styleData = body.styles.map((style) => {
        return {
            crewId: crew.id,
            styleId: style,
        }
    })
    await prisma.crewStyle.createMany({
        data: styleData
    });
    return crew.id;
}

export const createApplicationForm = async (body, crewId) => {
    const data = body.applicationForm.map((item) => {
        return {
            question: item.question,
            questionType: item.type,
            choiceList: {
                list: item.choices
            },
            isEtc: item.etc,
            required: item.required,
            crewId: crewId
        }
    })
    return prisma.crewRecruitForm.createMany({
        data: data
    });
}

export const updateCrewBanner = async (crewId, fileName) => {
    return prisma.crew.update({
        where: {
            id: crewId
        },
        data: {
            bannerImage: fileName
        }
    });
}