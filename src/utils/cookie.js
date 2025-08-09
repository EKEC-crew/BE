/**
 * **[Cookie]**
 * **\<🪛 Utils\>**
 * ***setTokenCookies***
 * 로그인 시 사용되는 엑세스 토큰과 리프레시 토큰을 쿠키로 저장합니다.
 * @param {Object} res - [응답 객체]
 * @param {String} accessToken - [엑세스 토큰]
 * @param {String} refreshToken - [리프레시 토큰]
 */
export const setTokenCookies = (res, accessToken, refreshToken) => {
  // 🍪 엑세스 토큰을 쿠키로 저장(Http-only)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.SERVER_ENV === "production",
    sameSite: process.env.SERVER_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 10,
  });
  // 🍪 리프레시 토큰을 쿠키로 저장(Http-only)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.SERVER_ENV === "production",
    sameSite: process.env.SERVER_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};
/**
 * **[Cookie]**
 * **\<🪛 Utils\>**
 * ***clearTokenCookies***
 * 액세스 토큰과 리프레시 토큰을 쿠키 저장소로부터 제거합니다.
 * @param {Object} res - [응답 객체]
 */
export const clearTokenCookies = (res) => {
  // 🍪 엑세스 토큰을 쿠키 저장소에서 제거
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.SERVER_ENV === "production",
    sameSite: process.env.SERVER_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 10,
  });
  // 🍪 리프레시 토큰을 쿠키 저장소에서 제거
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.SERVER_ENV === "production",
    sameSite: process.env.SERVER_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};
