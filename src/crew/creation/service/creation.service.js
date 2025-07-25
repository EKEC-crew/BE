import {createApplicationForm, createCrew, updateCrewBanner} from "../repository/creation.repository.js";
import {responseFromCreateNewCrew} from "../dto/response/creation.response.dto.js";
import {uploadBannerImage} from "../../image/service/image.service.js"

export const createNewCrew = async (body) => {
    const crewId = await createCrew(body);
    await createApplicationForm(body, crewId);
    const bannerFileName = (await uploadBannerImage(body.bannerImage, crewId)).split('/').at(-1);
    await updateCrewBanner(crewId, bannerFileName);
    return responseFromCreateNewCrew({crewId})
}