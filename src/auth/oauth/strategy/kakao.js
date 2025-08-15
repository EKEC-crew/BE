import passport from "passport";
import Kakao from "passport-kakao";
import { oauthLoginRegister } from "../../service/auth.service.js";
const KakaoStrategy = Kakao.Strategy;

const createKakaoStrategy = () => {
  return new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: "/api/auth/oauth/kakao/redirect",
    },
    (access_token, refresh_token, profile, done) => {
      return verify(profile, done);
    }
  );
};

const verify = async (profile, done) => {
  const data = {
    email: profile._json.kakao_account.email,
    platform: "KAKAO",
    id: profile.id.toString(),
  };
  const result = await oauthLoginRegister(data);
  done(null, result);
};

export default createKakaoStrategy;
