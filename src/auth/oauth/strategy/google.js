import Google from "passport-google-oauth20";
import { oauthLoginRegister } from "../../service/auth.service.js";

const GoogleStrategy = Google.Strategy;

const createGoogleStrategy = () => {
  return new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/oauth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      return verify(profile, done);
    }
  );
};

const verify = async (profile, done) => {
  console.log(profile.id);
  const data = {
    email: profile.emails[0].value,
    platform: "GOOGLE",
    id: profile.id,
  };
  const result = await oauthLoginRegister(data);
  done(null, result);
};

export default createGoogleStrategy;
