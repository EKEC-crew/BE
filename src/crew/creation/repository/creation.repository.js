import { prisma } from "../../../db.config.js";
/**
 * **[Crew Creation]**
 * **\<📦 Repository\>**
 * ***createCrew***
 * '크루 생성' 기능의 레포지토리 레이어 입니다. DB의 크루, 액티비티, 스타일 테이블에 새 크루 정보를 삽입하고 새 크루의 ID값을 반환합니다.
 * @param {object} body
 * @returns {number}
 */
export const createCrew = async (body) => {
  // ✅ 유효성 검사 (카테고리)
  const isCategoryValid =
    (await prisma.crewCategory.findFirst({
      select: {
        id: true,
      },
      where: {
        id: body.category,
      },
    })) !== null;
  if (!isCategoryValid) return -1;
  // ✅ 유효성 검사 (활동)
  const isActivitiesValid =
    (
      await prisma.activity.aggregate({
        _count: {
          id: true,
        },
        where: {
          id: {
            in: body.activities,
          },
        },
      })
    )._count.id === body.activities.length;
  if (!isActivitiesValid) return -2;
  // ✅ 유효성 검사 (스타일)
  const isStylesValid =
    (
      await prisma.style.aggregate({
        _count: {
          id: true,
        },
        where: {
          id: {
            in: body.styles,
          },
        },
      })
    )._count.id === body.styles.length;
  if (!isStylesValid) return -3;
  // ✅ 유효성 검사 (지역)
  if (body.region !== null) {
    const isRegionValid =
      (await prisma.region.findFirst({
        select: {
          id: true,
        },
        where: {
          id: body.region,
        },
      })) !== null;
    if (!isRegionValid) return -4;
  }
  // ✅ 유효성 검사 (유저)
  const isExistUser = await prisma.user.findFirst({
    select: {
      id: true,
    },
    where: {
      id: body.admin,
    },
  });
  if (!isExistUser) return -5;
  // 크루 테이블에 새로운 크루 레코드 추가
  const crew = await prisma.crew.create({
    data: {
      title: body.name,
      content: body.description,
      introduction: body.recruitMessage,
      crewCapacity: body.maxCapacity,
      ageLimit: body.age,
      genderLimit: body.gender,
      recruitMessage: body.recruitMessage,
      score: 0,
      user: {
        connect: {
          id: body.admin,
        },
      },
      crewCategory: {
        connect: {
          id: body.category,
        },
      },
      region: body.region ? { connect: { id: body.region } } : undefined,
    },
  });
  // 크루 액티비티 테이블에 해당 크루의 액티비티 분류들 추가
  const activityData = body.activities.map((activity) => {
    return {
      crewId: crew.id,
      activityId: activity,
    };
  });
  await prisma.crewActivity.createMany({
    data: activityData,
  });
  // 크루 스타일 테이블에 해당 크루의 스타일 분류들 추가
  const styleData = body.styles.map((style) => {
    return {
      crewId: crew.id,
      styleId: style,
    };
  });
  await prisma.crewStyle.createMany({
    data: styleData,
  });
  // 크루 멤버 테이블에 해당 크루의 관리자 추가
  await prisma.crewMember.create({
    data: {
      crewId: crew.id,
      userId: body.admin,
      role: 2,
    },
  });
  // 추가 작업을 진행하기 위해 생성한 크루의 아이디 반환
  return crew.id;
};
/**
 * **[Crew Creation]**
 * **\<📦 Repository\>**
 * ***createApplicationForm***
 * '크루 생성' 기능의 레포지토리 레이어 입니다. DB에 바로 전에 생성한 크루의 ID를 바탕으로 신청서 양식정보를 테이블에 삽입합니다.
 * @param {object} body
 * @returns {number}
 */
export const createApplicationForm = async (body, crewId) => {
  // 신청서 양식을 DB의 컬럼 형태에 맞추어서 가공
  const data = body.applicationForm.map((item) => {
    return {
      question: item.question,
      questionType: item.type,
      choiceList: {
        list: item.choices,
      },
      isEtc: item.etc,
      required: item.required,
      crewId: crewId,
    };
  });
  // 크루 신청서 테이블에 모두 추가
  return prisma.crewRecruitForm.createMany({
    data: data,
  });
};
/**
 * **[Crew Creation]**
 * **\<📦 Repository\>**
 * ***updateCrewBanner***
 * '크루 생성' 기능의 레포지토리 레이어 입니다. DB에 해당하는 크루 레코드에 업로드한 배너 이미지의 파일명을 추가합니다.
 * @param {object} body
 * @returns {Object}
 */
export const updateCrewBanner = async (crewId, fileName) => {
  // 입력받는 크루 ID를 바탕으로 생성한 크루를 찾은 다음 해당 크루 레코드에 배너 이미지의 파일명을 넣어 업데이트
  return prisma.crew.update({
    where: {
      id: crewId,
    },
    data: {
      bannerImage: fileName,
    },
  });
};
