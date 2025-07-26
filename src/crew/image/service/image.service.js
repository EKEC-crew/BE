import {Buffer} from 'buffer'
import {s3} from "../../../index.js";

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