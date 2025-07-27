import { Buffer } from 'buffer'
import { s3 } from "../../index.js";
import { responseFromGetImageURL } from '../dto/response/image.response.dto.js';
import { v4 as uuidv4 } from "uuid";
/**
 * **[Image]**
 * **\<🛠️ Service\>**
 * ***uploadBannerImage***
 * 배너 이미지 업로드를 위한 서비스 레이어 입니다. S3 버킷으로 입력받은 배너파일을 업로드 요청합니다.
 * @param {Object} file
 * @returns {Object}
 */
export const uploadBannerImage = async (file) => {
    // 원본 파일의 확장자
    const originalExtension = file.originalname.split(".").at(-1);
    // 새 파일명으로 지정할 랜덤한 UUID 생성
    const id = uuidv4();
    // 새 파일명 조합
    const fileName = `${id}.${originalExtension}`;
    // S3 버킷에 업로드 요청
    const data = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `crewBanner/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype
    }).promise();
    // 업로드 된 파일의 URL 반환
    return data.Location;
}
/**
 * **[Image]**
 * **\<🛠️ Service\>**
 * ***generatePresignedURL***
 * '이미지 로드' 기능의 서비스 레이어 입니다. AWS로 Presigned URL을 요청하여 받은 다음 반환합니다.
 * @param {Object} data
 * @returns {Object}
 */
export const generatePresignedURL = (data) => {
    // 타입에 따른 경로명
    const typeEnum = ["crewBanner", "profile"];
    // AWS SDK를 통하여 Presigned URL 발급 요청
    const getSignedUrlForGet = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${typeEnum[data.type]}/${data.fileName}`,
        Expires: 60 * 2
    });
    // Presigned URL 값 반환
    return responseFromGetImageURL({ getSignedUrlForGet });
}