import express from "express";
import passport from "passport";
import { setTokenCookies } from "../../../utils/cookie.js";
const router = express.Router();
/**
 * **[Auth]**
 * **\<🔀 Route\>**
 * ***handleOAuthRedirect***
 * oAuth의 반환값을 가지고 리다이렉트하는 함수입니다.
 * @param {object} req
 * @param {object} res
 */
const handleOAuthRedirect = (req, res) => {
  if (req.user == -1) {
    res.redirect(
      `${process.env.FRONT_DOMAIN}${process.env.OAUTH_FAILED_REDIRECT_PATH}?code=1`,
    );
    return;
  }
  setTokenCookies(res, req.user.tokens.access, req.user.tokens.refresh);
  res.redirect(
    `${process.env.FRONT_DOMAIN}${process.env.OAUTH_SUCCESS_REDIRECT_PATH}`,
  );
};

router.get(
  // #swagger.ignore = true
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  // #swagger.ignore = true
  "/google/redirect",
  passport.authenticate("google", {
    session: false,
  }),
  handleOAuthRedirect,
);

router.get(
  // #swagger.ignore = true
  "/naver",
  passport.authenticate("naver", { authType: "reprompt" }),
);

router.get(
  // #swagger.ignore = true
  "/naver/redirect",
  passport.authenticate("naver", {
    session: false,
  }),
  handleOAuthRedirect,
);

router.get(
  // #swagger.ignore = true
  "/kakao",
  passport.authenticate("kakao"),
);

router.get(
  // #swagger.ignore = true
  "/kakao/redirect",
  passport.authenticate("kakao", {
    session: false,
  }),
  handleOAuthRedirect,
);

router.get("/fail", (req, res) => {
  // #swagger.ignore = true
  res.redirect(`${process.env.FRONT_DOMAIN}/oauth/fail`);
});

export default router;
