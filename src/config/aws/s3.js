import AWS from "aws-sdk";
/**
 * **\<⚙️ Config\>**
 * ***initS3***
 * AWS S3 환경을 설정하고 S3객체를 반환합니다.
 */
export const initS3 = () => {
    //AWS S3 환경 설정
    AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    // 설정한 환경을 바탕으로 S3객체 생성후 반환
    return new AWS.S3();
}