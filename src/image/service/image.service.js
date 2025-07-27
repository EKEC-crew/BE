import { Buffer } from 'buffer'
import { s3 } from "../../index.js";
import { responseFromGetImageURL } from '../dto/response/image.response.dto.js';
/**
 * **[Image]**
 * **\<🛠️ Service\>**
 * ***uploadBannerImage***
 * 배너 이미지 업로드를 위한 서비스 레이어 입니다. S3 버킷으로 입력받은 배너파일을 업로드 요청합니다.
 * @param {Object} file
 * @param {Number} crewId
 * @returns {Object}
 */
export const uploadBannerImage = async (file, crewId) => {
    const originalExtension = file.originalname.split(".").at(-1);
    const encodedFileName = `${Buffer.from(`crew_banner_image_${crewId}`).toString('base64')}.${originalExtension}`;
    const data = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `crewBanner/${encodedFileName}`,
        Body: file.buffer,
        ContentType: file.mimetype
    }).promise();
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