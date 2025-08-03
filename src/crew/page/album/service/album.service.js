import * as baseError from "../../../../error.js";
import * as s3Function from "../../../../utils/s3.js";
import * as albumRepository from "../repository/album.repository.js";
import * as albumResponse from "../dto/response/album.response.dto.js";

export const readAlbumImages = async ({ crewId }) => {
    try {
        const isExistCrew = await albumRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const imagesInfo = await albumRepository.getAlbumImagesByCrewId({ crewId });
        return albumResponse.CrewAlbumImagesResponse(imagesInfo);
    } catch (err) {
        throw err;
    }
}

export const createAlbumImage = async ({ userId, crewId, image }) => {
    try {
        const isExistCrew = await albumRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const crewMember = await albumRepository.findCrewMember({
            userId,
            crewId,
        })
        if (!crewMember) {
            throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId })
        }
        const crewMemberId = crewMember.id;
        const imageName = await s3Function.uploadToS3(image, 3);
        const imageInfo = await albumRepository.addImage({ crewId, crewMemberId, imageName });

        return albumResponse.CrewAlbumImageResponse(imageInfo);
    } catch (err) {
        throw err;
    }
}