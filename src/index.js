import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
//express 모듈 불러오기
//const express = require('express')  -> CommonJs
import express from "express"; // -> ES Module

//swagger 세팅
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

//session, passport 세팅
import { prisma } from "./db.config.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";

import routes from './route/route.js'

const app = express();
const port = process.env.PORT;


/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, data: success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      data: null,
    });
  };

  next();
});
/** session */
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: [process.env.LOCAL_ORIGIN, process.env.PROD_ORIGIN],
  credentials: true,
};

app.use(cors(corsOptions)); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
// 미들웨어 설정
app.use(express.json()); // JSON 본문 파싱

app.use('/api', routes); // 라우터 연결

//전역 에러 처리 미들웨어는 모든 미들웨어와 라우터 등록 이후에 맨 마지막에 위치해야 합니다.
/**
 * 전역 오류를 처리하기 위한 미들웨어
=> 이 미들웨어는 Controller 내에서 별도로 처리하지 않은 오류가 발생할 경우, 
모두 잡아서 공통된 오류 응답으로 내려주게 됩니다.
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

//Swagger 세팅
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: "/openapi.json",
      },
    }
  )
);

//Swagger 세팅
app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "EKEC 이크에크",
      version: '1.0.0',
      description: "EKEC 이크에크 프로젝트입니다.",
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: "개발 서버",
      },
      {
        url: "https://api.ekec.site",
        description: "라이브 서버",
      }
    ],
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

/**logger setting*/
const myLogger = (req, res, next) => {
  console.log("LOGGED");
  next();
}

app.use(myLogger);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

//app.listen() : 서버를 특정포트에서 실행하는 함수
//서버가 성공적으로 시작되었을때 콜백함수 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// "/" 경로의 미들웨어
app.get("/", (req, res) => {
  // #swagger.ignore = true
  console.log("/");
  res.send("Hello UMC!");
});
