import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver-v2";
import { oauthLoginRegister } from "../../service/auth.service.js";

const createNaverStrategy = () => {
  return new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: "/api/auth/oauth/naver/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      return verify(profile, done);
    }
  );
};

const verify = async (profile, done) => {
  const data = {
    email: profile.email,
    platform: "NAVER",
    id: profile.id,
  };
  const result = await oauthLoginRegister(data);
  done(null, result);
};

export default createNaverStrategy;
