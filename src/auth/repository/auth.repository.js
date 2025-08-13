import { prisma } from "../../db.config.js";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***createAccount***
 * '회원가입' 기능의 레포지토리 레이어 입니다. DB의 유저 테이블에 새 유저 정보를 삽입하고 새 유저의 ID값을 반환합니다.
 * @param {object} data
 * @returns {number}
 */
export const createAccount = async (data) => {
  const isExistEmail = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (isExistEmail) return -1;
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
    },
  });
  return user.id;
};
export const createOAuthAccount = async (data) => {
  const isExistEmail = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (isExistEmail) return -1;
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: null,
    },
  });
  await prisma.oAuth.create({
    data: {
      userId: user.id,
      platform: data.platform,
      platformId: data.id,
    },
  });
  return user.id;
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***updateProfile***
 * '프로필 수정' 기능의 레포지토리 레이어 입니다. 지정한 유저의 프로필 정보를 수정합니다.
 * @param {object} data
 * @returns {object}
 */
export const updateProfile = async (data) => {
  const user = await prisma.user.update({
    where: {
      id: data.payload.id,
    },
    data: {
      name: data.name,
      nickname: data.nickname,
      birth: DateTime.fromISO(
        `${data.birthday.year}-${data.birthday.month.toString().padStart(2, "0")}-${data.birthday.day.toString().padStart(2, "0")}`,
        { zone: "utc" },
      ),
      gender: data.gender,
      phone: data.phone,
      image: data.profileImageName,
      isCompleted: true,
    },
  });
  return user;
};

/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***findAccount***
 * '로그인' 기능의 레포지토리 레이어 입니다. DB의 유저 테이블에서 이메일과 비밀번호를 통해 유저 정보를 조회 및 검증합니다.
 * @param {object} data
 * @returns {number}
 */
export const findAccount = async (data) => {
  const user = await prisma.user.findUnique({
    select: {
      name: true,
      nickname: true,
      gender: true,
      birth: true,
      phone: true,
      email: true,
      id: true,
      password: true,
      image: true,
      isCompleted: true,
    },
    where: {
      email: data.email,
    },
  });
  if (!user) return -1;
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) return -2;
  return user;
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***createRefreshToken***
 * '리프레시 토큰 갱신' 기능의 레포지토리 레이어 입니다. 발급받은 리프레시 토큰을 DB에 저장합니다.
 * @param {string} refreshToken
 * @param {number} userId
 * @returns {number}
 */
export const createRefreshToken = async (refreshToken, userId) => {
  const token = await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return token.id;
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***deleteRefreshToken***
 * '리프레시 토큰 갱신' 기능의 레포지토리 레이어 입니다. DB에 저장된 리프레시 토큰을 삭제합니다.
 * @param {string} refreshToken
 * @returns {number}
 */
export const deleteRefreshToken = async (token) => {
  const refreshTokenId = await prisma.refreshToken.findFirst({
    select: {
      id: true,
    },
    where: {
      token: token,
    },
  });
  if (!refreshTokenId) return -1;
  const refreshToken = await prisma.refreshToken.delete({
    where: {
      id: refreshTokenId.id,
    },
  });

  return refreshTokenId.id;
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***updateRefreshToken***
 * '리프레시 토큰 갱신' 기능의 레포지토리 레이어 입니다. DB에 저장된 리프레시 토큰을 업데이트 합니다.
 * @param {string} oldToken
 * @param {string} newToken
 * @returns {number}
 */
export const updateRefreshToken = async (oldToken, newToken) => {
  const refreshTokenId = await prisma.refreshToken.findFirst({
    select: {
      id: true,
    },
    where: {
      token: oldToken,
    },
  });
  if (!refreshTokenId) return -1;
  const refreshToken = await prisma.refreshToken.update({
    where: {
      id: refreshTokenId.id,
    },
    data: {
      token: newToken,
    },
  });
  return refreshTokenId.id;
};

/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***findAccountById***
 * '리프레시 토큰 갱신' 기능의 레포지토리 레이어 입니다. 페이로드의 유저 아이디를 통해 유저 정보를 조회합니다.
 * @param {string} id
 * @returns {number}
 */
export const findAccountById = async (id) => {
  const user = await prisma.user.findUnique({
    select: {
      name: true,
      nickname: true,
      gender: true,
      birth: true,
      phone: true,
      email: true,
      phone: true,
      id: true,
      password: true,
      image: true,
      isCompleted: true,
    },
    where: {
      id: id,
    },
  });
  if (!user) return -1;
  return user;
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***findRefreshToken***
 * '리프레시 토큰 갱신' 기능의 레포지토리 레이어 입니다. 활성화 되어있는 리프레시 토큰 인지 확인합니다.
 * @param {string} token
 * @returns {string}
 */
export const findRefreshToken = async (token) => {
  const refreshToken = await prisma.refreshToken.findFirst({
    select: {
      id: true,
    },
    where: {
      token: token,
    },
  });
  if (!refreshToken) return -1;
  return refreshToken;
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***findRefreshToken***
 * '리프레시 토큰 갱신' 기능의 레포지토리 레이어 입니다. 유저 ID를 통해 리프레시 토큰을 조회합니다.
 * @param {string} id
 * @returns {string}
 */
export const findRefreshTokenByUserId = async (id) => {
  const refreshToken = await prisma.refreshToken.findFirst({
    select: {
      id: true,
      token: true,
    },
    where: {
      userId: id,
    },
  });
  if (!refreshToken) return -1;
  return refreshToken;
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***findAccountByPhone***
 * 전화번호를 이용해 계정을 검색합니다.
 * @param {string} phone
 * @param {number} id
 * @returns {object}
 */
export const findAccountByPhone = async (phone, id) => {
  const account = await prisma.user.findFirst({
    where: {
      NOT: {
        id: id,
      },
      phone: phone,
    },
  });
  if (!account) return -1;
  return account;
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***deleteExpiredRefreshTokens***
 * 만료된 리프레시 토큰을 삭제합니다.
 */
export const deleteExpiredRefreshTokens = async () => {
  const currentTime = DateTime.fromISO(
    DateTime.now({ zone: "Asia/Seoul" })
      .toFormat("yyyy-MM-dd'T'HH:mm:ss")
      .toString(),
    { zone: "utc" },
  );
  const adjustedTime = currentTime.minus({ days: 7 });
  await prisma.refreshToken.deleteMany({
    where: {
      modifiedAt: {
        lt: adjustedTime.toJSDate(),
      },
    },
  });
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***deleteUncompletedUsers***
 * 가입 미완료 사용자를 삭제합니다.
 */
export const deleteUncompletedUsers = async () => {
  const currentTime = DateTime.fromISO(
    DateTime.now({ zone: "Asia/Seoul" })
      .toFormat("yyyy-MM-dd'T'HH:mm:ss")
      .toString(),
    { zone: "utc" },
  );
  const adjustedTime = currentTime.minus({ days: 1 });
  await prisma.user.deleteMany({
    where: {
      modifiedAt: {
        lt: adjustedTime.toJSDate(),
      },
      isCompleted: false,
      refreshToken: {
        none: {},
      },
    },
  });
};
/**
 * **[Auth]**
 * **\<📦 Repository\>**
 * ***findUserByPlatformId***
 * 플랫폼 ID로 사용자를 찾습니다.
 */
export const findUserByPlatformId = async (data) => {
  const user = await prisma.oAuth.findFirst({
    select: {
      user: {
        select: {
          name: true,
          nickname: true,
          email: true,
          phone: true,
          id: true,
          password: true,
          image: true,
          isCompleted: true,
        },
      },
    },
    where: {
      platformId: data.id,
      platform: data.platform,
    },
  });
  if (!user) return -1;
  return user.user;
};
