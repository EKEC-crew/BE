import { prisma } from "../../../../db.config.js"

export const findCrewsByName = async (data) => {
    const crews = await prisma.crew.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            introduction: true,
            crewCapacity: true,
            createdAt: true,
            noticeCount: true,
            postCount: true,
            bannerImage: true,
            ageLimit: true,
            genderLimit: true,
            user: {
                select: {
                    name: true
                }
            },
            crewCategory: {
                select: {
                    content: true
                }
            },
            region: {
                select: {
                    sido: true,
                    goo: true
                }
            },
            crewActivity: {
                select: {
                    activity: {
                        select: {
                            content: true
                        }
                    }
                }
            },
            crewStyle: {
                select: {
                    style: {
                        select: {
                            content: true
                        }
                    }
                }
            }
        },
        where: {
            title: {
                contains: data.name
            }
        }
    })

    return crews;
}

export const findCrewsByOptions = async (data) => {
    const whereOnOptions = {}
    if (data.name != undefined) whereOnOptions.title = {
        contains: data.name
    };
    if (data.category != undefined) whereOnOptions.categoryId = data.category;
    if (data.gender != undefined) whereOnOptions.genderLimit = data.gender;
    if (data.age != undefined) whereOnOptions.ageLimit = data.age;
    if (data.region != undefined) whereOnOptions.regionId = data.region;
    const filteredByOptions = await prisma.crew.findMany({
        select: {
            id: true
        },
        where: whereOnOptions
    });
    if (filteredByOptions.length == 0) return filteredByOptions;
    const crewIdOffilteredByOptions = filteredByOptions.map(item => item.id);

    const whereOnActivity = {};
    if (data.activity != undefined) whereOnActivity.activityId = {
        in: data.activity
    };
    whereOnActivity.crewId = {
        in: crewIdOffilteredByOptions
    }
    const filteredByActivity1 = await prisma.crewActivity.groupBy({
        by: ['crewId'],
        where: whereOnActivity,
        _count: {
            _all: true
        },
    })
    const filteredByActivity2 = filteredByActivity1.filter(crew => {
        if (data.activity == undefined) return true;
        return crew._count._all == data.activity.length
    })
    if (filteredByActivity2.length == 0) return filteredByActivity2;
    const crewIdOfFilteredByActivity = filteredByActivity2.map(item => item.crewId);

    const whereOnStyle = {};
    if (data.style != undefined) whereOnStyle.styleId = {
        in: data.style
    }
    whereOnStyle.crewId = {
        in: crewIdOfFilteredByActivity
    }
    const filteredByStyle1 = await prisma.crewStyle.groupBy({
        by: ['crewId'],
        where: whereOnStyle,
        _count: {
            _all: true
        }
    })
    const filteredByStyle2 = filteredByStyle1.filter(crew => {
        if (data.style == undefined) return true;
        return crew._count._all == data.style.length
    });
    if (filteredByStyle2.length == 0) return filteredByStyle2;
    const crewIdOfFilteredByStyle = filteredByStyle2.map(item => item.crewId);

    const finallyFilteredResult = await prisma.crew.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            introduction: true,
            crewCapacity: true,
            createdAt: true,
            noticeCount: true,
            postCount: true,
            bannerImage: true,
            ageLimit: true,
            genderLimit: true,
            user: {
                select: {
                    name: true
                }
            },
            crewCategory: {
                select: {
                    content: true
                }
            },
            region: {
                select: {
                    sido: true,
                    goo: true
                }
            },
            crewActivity: {
                select: {
                    activity: {
                        select: {
                            content: true
                        }
                    }
                }
            },
            crewStyle: {
                select: {
                    style: {
                        select: {
                            content: true
                        }
                    }
                }
            }
        },
        where: {
            id: {
                in: crewIdOfFilteredByStyle
            }
        },
        orderBy: {
            id: 'asc'
        },
        skip: 10 * (data.page - 1),
        take: 10
    })
    return finallyFilteredResult;
}