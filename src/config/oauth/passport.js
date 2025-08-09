import passport from "passport";
import googleStrategy from "../../auth/oauth/strategy/google.js";
import naverStrategy from "../../auth/oauth/strategy/naver.js";
import kakaoStrategy from "../../auth/oauth/strategy/kakao.js";

const initPassport = () => {
  passport.use(googleStrategy);
  passport.use(naverStrategy);
  passport.use(kakaoStrategy);
};

export default initPassport;
