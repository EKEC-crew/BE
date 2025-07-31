import { Buffer } from "buffer";
import { s3 } from "../../index.js";
import { responseFromGetImage } from "../dto/response/image.response.dto.js";
import { v4 as uuidv4 } from "uuid";
import { generatePresignedUrlForGet } from "../../utils/s3.js";
/**
 * **[Image]**
 * **\<🛠️ Service\>**
 * ***getImageURL***
 * 이미지를 로드하기 위한 API의 서비스 레이어 입니다. 이미지에 대한 Presigned URL 생성 및 반환합니다.
 * @param {Object} data
 * @returns {Object}
 */
export const getImageURL = (data) => {
  // 이미지에 대한 Presigned URL 생성
  const imageUrl = generatePresignedUrlForGet(data.type, data.fileName);
  // Presigned URL 값 반환
  return responseFromGetImage({ imageUrl });
};
