import { v4 as uuidv4 } from "uuid";
import { s3 } from "../index.js";

const typeEnum = ["crewBanner", "userProfile", "crewPost", "crewAlbum"];
/**
 * **[s3]**
 * **\<🪛 Utils\>**
 * ***uploadToS3***
 * s3로 이미지 파일을 업로드 하기 위한 유틸 입니다. S3 버킷으로 입력받은 이미지 파일을 업로드 요청합니다.
 * @param {Buffer} file - [업로드할 파일의 버퍼]
 * @param {Number} type - [이미지 타입 - 0 : 배너 이미지, 1 : 프로필 이미지, 2 : 게시글 이미지, 3 : 앨범 이미지 ]
 * @returns {String} - [업로드된 파일의 이름]
 */
export const uploadToS3 = async (file, type) => {
  // 원본 파일의 확장자
  const originalExtension = file.originalname.split(".").at(-1);
  // 새 파일명으로 지정할 랜덤한 UUID 생성
  const id = uuidv4();
  // 새 파일명 조합
  const fileName = `${id}.${originalExtension}`;
  // S3 버킷에 업로드 요청
  const data = await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${typeEnum[type]}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
    .promise();
  return fileName;
};
/**
 * **[s3]**
 * **\<🪛 Utils\>**
 * ***generatePresignedUrlForGet***
 * 이미지 로드 Presigned URL 발급 유틸 입니다. AWS로 Presigned URL을 요청하여 받은 다음 반환합니다.
 * @param {Number} type - [이미지 타입 - 0 : 배너 이미지, 1 : 프로필 이미지, 2 : 게시글 이미지, 3 : 앨범 이미지 ]
 * @param {String} fileName - [이미지 파일 명]
 * @returns {String} - [Presigned URL]
 */
export const generatePresignedUrlForGet = (type, fileName) => {
  // AWS SDK를 통하여 Presigned URL 발급 요청
  const presignedUrl = s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${typeEnum[type]}/${fileName}`,
    Expires: 60 * 2,
  });
  // Presigned URL 값 반환
  return presignedUrl;
};
