import jwt from "jsonwebtoken";
// 토큰 만료 시간 설정
const expirations = {
  access: "10m",
  refresh: "7d",
};
/**
 * **[JWT]**
 * **\<🪛 Utils\>**
 * ***generateAccessToken***
 * 로그인 시 사용되는 액세스 토큰을 생성합니다.
 * @param {Object} payload - [토큰에 포함될 정보]
 * @returns {String} - [생성된 액세스 토큰]
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: expirations.access,
  });
};
/**
 * **[JWT]**
 * **\<🪛 Utils\>**
 * ***generateRefreshToken***
 * 로그인 시 사용되는 리프레시 토큰을 생성합니다.
 * @param {Object} payload - [토큰에 포함될 정보]
 * @returns {String} - [생성된 리프레시 토큰]
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: expirations.refresh,
  });
};
/**
 * **[JWT]**
 * **\<🪛 Utils\>**
 * ***verifyAccessToken***
 * 액세스 토큰을 검증합니다.
 * @param {String} token - [검증할 액세스 토큰]
 * @returns {Object} - [검증된 페이로드]
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};
/**
 * **[JWT]**
 * **\<🪛 Utils\>**
 * ***verifyRefreshToken***
 * 리프레시 토큰을 검증합니다.
 * @param {String} token - [검증할 리프레시 토큰]
 * @returns {Object} - [검증된 페이로드]
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
