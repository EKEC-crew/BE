// prisma/seed.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("시드 데이터 생성을 시작합니다...");

  // 1. 테스트용 유저 생성 (비밀번호는 실제로는 해싱해야 합니다)
  const user1 = await prisma.user.create({
    data: {
      email: "testuser@example.com",
      password: "password123",
      nickname: "테스트유저",
      createdAt: new Date(),
    },
  });

  // 2. 테스트용 지역 및 카테고리 생성
  const region1 = await prisma.region.create({
    data: {
      sido: "서울특별시",
      goo: "강남구",
    },
  });

  const category1 = await prisma.crewCategory.create({
    data: {
      content: "운동/스포츠",
    },
  });

  // 3. 테스트용 크루 생성 (위에서 만든 유저, 지역, 카테고리를 연결)
  const crew1 = await prisma.crew.create({
    data: {
      title: "강남 저녁 달리기 크루",
      content: "매주 화요일 저녁에 달리기 하실 분들을 모집합니다.",
      introduction: "초보자도 환영합니다! 함께 건강하게 달려요.",
      score: 0,
      crewCapacity: 10,
      ageLimit: 30,
      genderLimit: 0, // 0: 성별 무관
      createdAt: new Date(),
      // 관계 연결
      userId: user1.id,
      categoryId: category1.id,
      regionId: region1.id,
    },
  });

  // 4. 생성된 유저를 생성된 크루의 '멤버'로 등록 (매우 중요!)
  // 이래야 해당 유저가 크루에 공지를 쓸 수 있습니다.
  const member1 = await prisma.crewMember.create({
    data: {
      userId: user1.id,
      crewId: crew1.id,
      role: 1, // 1: 크루장
      createdAt: new Date(),
    },
  });

  // 5. 공지사항 더미 데이터 삽입
  await prisma.crewNotice.create({
    data: {
      title: "테스트 공지",
      content: "API 작동 테스트",
      createdAt: new Date(),
      crew: {
        connect: { id: crew1.id },
      },
      crewMember: {
        connect: { id: member1.id },
      },
    },
  });

  console.log("✅ 시드 데이터 생성 완료:");
  console.log(`- 유저: ${user1.nickname} (ID: ${user1.id})`);
  console.log(`- 크루: ${crew1.title} (ID: ${crew1.id})`);
  console.log(`- 멤버: ${member1.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 스크립트 실행이 끝나면 데이터베이스 연결을 끊습니다.
    await prisma.$disconnect();
  });
