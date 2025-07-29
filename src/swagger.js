// swagger.js
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "EKEC API",
    description: "EKEC 프로젝트 API 문서입니다.",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json"; // ✅ 실제 생성
const endpointsFiles = ["./src/route/route.js"]; // ✅ 실제 라우터 파일 경로!

swaggerAutogen()(outputFile, endpointsFiles, doc);
