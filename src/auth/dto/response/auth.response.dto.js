/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromSignUp***
 * '회원가입' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromSignUp = (data) => {
  return {
    userId: data.userId,
    email: data.body.email,
  };
};
/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromLogin***
 * '로그인' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromLogin = (data) => {
  return {
    accessToken: data.tokens.access,
    refreshToken: data.tokens.refresh,
    user: {
      id: data.payload.id,
      email: data.payload.email,
      name: data.payload.name,
      phone: data.payload.phone,
      birth: data.payload.birth,
      gender: data.payload.gender,
      nickname: data.payload.nickname,
      profileImage: data.payload.profileImage,
      isCompleted: data.payload.isCompleted,
    },
  };
};
/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromRefresh***
 * '리프레시 토큰 갱신' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromRefresh = (data) => {
  return {
    accessToken: data.tokens.access,
    refreshToken: data.tokens.refresh,
    user: {
      id: data.newPayload.id,
      email: data.newPayload.email,
      name: data.newPayload.name,
      phone: data.newPayload.phone,
      birth: data.newPayload.birth,
      gender: data.newPayload.gender,
      nickname: data.newPayload.nickname,
      profileImage: data.newPayload.profileImage,
      isCompleted: data.newPayload.isCompleted,
    },
  };
};
/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromLogout***
 * '로그아웃' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromLogout = (data) => {
  return null;
};
/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromProfile***
 * '프로필 설정' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromProfile = (data) => {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    nickname: data.nickname,
    gender: data.gender,
    birthday: data.birth,
    phone: data.phone,
    image: data.image,
  };
};
