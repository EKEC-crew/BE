import { prisma } from "../../../../db.config.js";
/**
 * **[Crew Search]**
 * **\<📦 Repository\>**
 * ***findCrewsByName***
 * '크루명으로 검색' 기능의 레포지토리 레이어 입니다. DB로부터 검색결과를 가져와 서비스 레이어로 반환합니다.
 * @param {object} data
 * @returns
 */
export const findCrewsByName = async (data) => {
  //DB의 crew 스키마(테이블) 에서 해당 조건에 맞추어 Select해 반환 받기
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
          name: true,
        },
      },
      crewCategory: {
        select: {
          content: true,
        },
      },
      region: {
        select: {
          sido: true,
          goo: true,
        },
      },
      crewActivity: {
        select: {
          activity: {
            select: {
              content: true,
            },
          },
        },
      },
      crewStyle: {
        select: {
          style: {
            select: {
              content: true,
            },
          },
        },
      },
      _count: {
        select: {
          crewUser: true,
        },
      },
    },
    where: {
      title: {
        contains: data.name, // 크루 명으로 필터링
      },
      crewCapacity: data.capacity,
    },
    orderBy: data.sort, // 지정된 정렬방식에 맞추어 정렬
    skip: 10 * (data.page - 1), //페이지네이션 구문
    take: 10,
  });
  const crewCounts = await prisma.crew.count({
    where: {
      title: {
        contains: data.name, // 크루 명으로 필터링
      },
      crewCapacity: data.capacity,
    },
  });
  const result = {
    crews,
    crewCounts,
  };
  // DB 쿼리 결과를 그대로 서비스 레이어에 반환
  return result;
};

/**
 * **[Crew Search]**
 * **\<📦 Repository\>**
 * ***findCrewsByOptions***
 * '크루 찾아보기 (고급 검색)' 기능의 레포지토리 레이어 입니다. DB로부터 검색결과를 가져와 서비스 레이어로 반환합니다.
 * @param {object} data
 * @returns
 */
export const findCrewsByOptions = async (data) => {
  const whereOnOptions = {}; // 필터링 조건을 담기위한 객체
  if (data.name != undefined)
    whereOnOptions.title = {
      // 크루명이 존재하면 필터링에 추가
      contains: data.name,
    };
  if (data.category != undefined) whereOnOptions.categoryId = data.category; // 카테고리 값이 존재하면 필터링에 추가
  if (data.gender != undefined) whereOnOptions.genderLimit = data.gender; // 성별 값이 존재하면 필터링에 추가
  if (data.age != undefined) whereOnOptions.ageLimit = data.age; // 연령대 값이 존재하면 필터링에 추가
  if (data.region != undefined) whereOnOptions.regionId = data.region; // 지역 값이 존재하면 필터링에 추가
  // 먼저 위 5개의 필터링에 맞추어 crew 스키마(테이블)에서 Select 쿼리 실행 후 반환
  const filteredByOptions = await prisma.crew.findMany({
    select: {
      id: true,
    },
    where: whereOnOptions,
  });
  // 검색 결과가 없다면 빈 배열 반환
  if (filteredByOptions.length == 0) return filteredByOptions;
  // 검색 결과의 크루 아이디만을 별도의 배열로 저장
  const crewIdOffilteredByOptions = filteredByOptions.map((item) => item.id);
  // 액티비티 값으로 필터링을 하기 위한 객체
  const whereOnActivity = {};
  // 액티비티 값이 존재하면 필터링 추가
  if (data.activity != undefined)
    whereOnActivity.activityId = {
      in: data.activity,
    };
  // 위에서 검색했던 결과에서 세부검색을 위해 크루 ID 배열을 조건으로 추가
  whereOnActivity.crewId = {
    in: crewIdOffilteredByOptions,
  };
  // 액티비티 값 조건을 가지고 crewActivity 스키마(테이블) 에서 일치하는 자료 갯수 카운팅 후 반환
  const filteredByActivity1 = await prisma.crewActivity.groupBy({
    by: ["crewId"],
    where: whereOnActivity,
    _count: {
      _all: true,
    },
  });
  // 액티비티 필터링 값이 존재하지 않았다면 필터링 하지 않고, 있다면 지정한 액티비티 갯수와 같은 크루만 필터링하도록 함
  const filteredByActivity2 = filteredByActivity1.filter((crew) => {
    if (data.activity == undefined) return true;
    return crew._count._all == data.activity.length;
  });
  // 결과값이 0이면 빈 배열 반환
  if (filteredByActivity2.length == 0) return filteredByActivity2;
  // 다시 한번 검색결과에서 크루 ID만 추출하여 배열로 생성
  const crewIdOfFilteredByActivity = filteredByActivity2.map(
    (item) => item.crewId,
  );

  // 스타일 값으로 필터링을 위한 객체
  const whereOnStyle = {};
  // 만약 스타일 값이 존재한다면 필터링 추가
  if (data.style != undefined)
    whereOnStyle.styleId = {
      in: data.style,
    };
  // 위에서 검색했던 결과에서 세부검색을 위해 크루 ID 배열을 조건으로 추가
  whereOnStyle.crewId = {
    in: crewIdOfFilteredByActivity,
  };
  // 스타일 값 조건을 가지고 crewStyle 스키마(테이블) 에서 일치하는 자료 갯수 카운팅 후 반환
  const filteredByStyle1 = await prisma.crewStyle.groupBy({
    by: ["crewId"],
    where: whereOnStyle,
    _count: {
      _all: true,
    },
  });
  // 스타일 필터링 값이 존재하지 않았다면 필터링 하지 않고, 있다면 지정한 스타일 갯수와 같은 크루만 필터링하도록 함
  const filteredByStyle2 = filteredByStyle1.filter((crew) => {
    if (data.style == undefined) return true;
    return crew._count._all == data.style.length;
  });
  // 결과값이 0이면 빈 배열 반환
  if (filteredByStyle2.length == 0) return filteredByStyle2;
  // 최종적으로 필터링 된 크루의 ID들읠 배열로 생성
  const crewIdOfFilteredByStyle = filteredByStyle2.map((item) => item.crewId);
  // 최종적으로 필터링 된 크루들의 ID로 각 크루들의 세부정보를 Select 쿼리로 가져와 반환
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
          name: true,
        },
      },
      crewCategory: {
        select: {
          content: true,
        },
      },
      region: {
        select: {
          sido: true,
          goo: true,
        },
      },
      crewActivity: {
        select: {
          activity: {
            select: {
              content: true,
            },
          },
        },
      },
      crewStyle: {
        select: {
          style: {
            select: {
              content: true,
            },
          },
        },
      },
      _count: {
        select: {
          crewUser: true,
        },
      },
    },
    where: {
      id: {
        in: crewIdOfFilteredByStyle, // 최종 필터링 된 크루 ID 배열
      },
      crewCapacity: data.capacity,
    },
    orderBy: data.sort, // 지정받은 크루 정렬 방식
    skip: 10 * (data.page - 1), // 페이지네이션 구문
    take: 10,
  });
  const crewCounts = await prisma.crew.count({
    where: {
      id: {
        in: crewIdOfFilteredByStyle, // 최종 필터링 된 크루 ID 배열
      },
      crewCapacity: data.capacity,
    },
  });
  const result = {
    crewCounts,
    finallyFilteredResult,
  };
  // 최종 DB 쿼리 결과 반환
  return result;
};
/**
 * **[Crew Search]**
 * **\<📦 Repository\>**
 * ***findCrewsByCategory***
 * '크루 카테고리로 조회' 기능의 레포지토리 레이어 입니다. 카테고리로 크루를 조회합니다.
 * @param {object} data
 * @returns
 */
export const findCrewsByCategory = async (data) => {
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
          name: true,
        },
      },
      crewCategory: {
        select: {
          content: true,
        },
      },
      region: {
        select: {
          sido: true,
          goo: true,
        },
      },
      crewActivity: {
        select: {
          activity: {
            select: {
              content: true,
            },
          },
        },
      },
      crewStyle: {
        select: {
          style: {
            select: {
              content: true,
            },
          },
        },
      },
      _count: {
        select: {
          crewUser: true,
        },
      },
    },
    where: {
      categoryId: data.category,
      crewCapacity: data.capacity,
    },
    orderBy: data.sort, // 지정받은 크루 정렬 방식
    skip: 10 * (data.page - 1), // 페이지네이션 구문
    take: 10,
  });
  const crewCounts = await prisma.crew.count({
    where: {
      categoryId: data.category,
      crewCapacity: data.capacity,
    },
  });
  const result = {
    crewCounts,
    crews,
  };
  return result;
};
