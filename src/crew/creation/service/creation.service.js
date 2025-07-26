import { createApplicationForm, createCrew, updateCrewBanner } from "../repository/creation.repository.js";
import { responseFromCreateNewCrew } from "../dto/response/creation.response.dto.js";
import { uploadBannerImage } from "../../image/service/image.service.js"
/**
 * **[Crew Creation]**
 * **\<🛠️ Service\>**
 * ***createNewCrew***
 * '크루 생성' 기능의 서비스 레이어 입니다. 레포지토리를 통해 크루를 생성하고 배너 파일을 업로드 합니다.
 * @param {Object} body
 * @returns {Object}
 */
export const createNewCrew = async (body) => {
    // 크루를 생성하고 크루 ID를 저장합니다.
    const crewId = await createCrew(body);
    // 저장한 크루 ID를 이용해 신청서도 추가합니다.
    await createApplicationForm(body, crewId);
    // 배너 이미지를 S3에 업로드 한 다음 파일명만 잘라서 저장합니다.
    const bannerFileName = (await uploadBannerImage(body.bannerImage, crewId)).split('/').at(-1);
    // 크루 정보에 배너 이미지 파일명을 추가합니다.
    await updateCrewBanner(crewId, bannerFileName);
    // 크루 ID를 반환
    return responseFromCreateNewCrew({ crewId })
}