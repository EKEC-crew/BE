import passport from "passport";
import createGoogleStrategy from "../../auth/oauth/strategy/google.js";
import createNaverStrategy from "../../auth/oauth/strategy/naver.js";
import createKakaoStrategy from "../../auth/oauth/strategy/kakao.js";

const initPassport = () => {
  // Google OAuth는 환경변수가 설정된 경우에만 로드
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(createGoogleStrategy());
  }

  // Naver OAuth는 환경변수가 설정된 경우에만 로드
  if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
    passport.use(createNaverStrategy());
  }

  // Kakao OAuth는 환경변수가 설정된 경우에만 로드
  if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
    passport.use(createKakaoStrategy());
  }
};

export default initPassport;
