import { verifyAccessToken } from "../../utils/jwt.js";
import { InvalidTokenError } from "../../error.js";
import { detectDuplicateLogin } from "../service/auth.service.js";
/**
 * **[Auth]**
 * **\<🔌 Middleware\>**
 * ***authenticateAccessToken***
 * 엑세스 토큰 검증을 위한 미들웨어입니다.
 * @param {Object} req - [요청 객체]
 * @param {Object} res - [응답 객체]
 * @param {Function} next - [다음 미들웨어 함수]
 */
export const authenticateAccessToken = async (req, res, next) => {
  // 쿠키로 부터 액세스 토큰만 추출
  const { accessToken } = req.cookies;
  // 액세스 토큰이 존재하지 않은 경우 에러를 반환합니다.
  if (!accessToken)
    throw new InvalidTokenError("유효하지 않은 인증 토큰 입니다.");
  // 토큰을 검증하고 페이로드를 가져옵니다.
  const payload = verifyAccessToken(accessToken);
  // 토큰이 유효하지 않은 경우 에러를 반환합니다.
  if (!payload) throw new InvalidTokenError("유효하지 않은 인증 토큰 입니다.");
  // 중복 로그인을 감지합니다.
  const result = await detectDuplicateLogin(payload);
  if (result !== true) {
    next(result);
  }
  // 요청 객체에 디코딩한 페이로드를 첨부하여 다음 미들웨어로 전달합니다.
  req.payload = payload;
  next();
};
/**
 * **[Auth]**
 * **\<🔌 Middleware\>**
 * ***verifyUserIsActive***
 * 계정의 활성화 여부를 검사하는 미들웨어 입니다.
 * @param {Object} req - [요청 객체]
 * @param {Object} res - [응답 객체]
 * @param {Function} next - [다음 미들웨어 함수]
 */
export const verifyUserIsActive = (req, res, next) => {
  // ✅ 유효성 검사 (유저 권한)
  if (!req.payload.isCompleted) {
    next(new InvalidTokenError("유효하지 않은 인증 토큰입니다.", req.body));
  }
  next();
};
