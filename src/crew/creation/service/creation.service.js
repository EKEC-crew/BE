import { createApplicationForm, createCrew, updateCrewBanner } from "../repository/creation.repository.js";
import { responseFromCreateNewCrew } from "../dto/response/creation.response.dto.js";
import { uploadBannerImage } from "../../../image/service/image.service.js"
import { UnprocessableInputValueError } from "../../../error.js";
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
    // 에러 값 반환을 위해 파일부를 제외한 body (restBody)
    const { bannerImage, ...restBody } = body;
    // 유효하지 않는 카테고리일 경우
    if (crewId === -1) throw new UnprocessableInputValueError("유효하지 않은 카테고리 입니다.", restBody)
    // 유효하지 않는 활동일 경우
    if (crewId === -2) throw new UnprocessableInputValueError("유효하지 않은 활동 분류 입니다.", restBody)
    // 유효하지 않는 스타일일 경우
    if (crewId === -3) throw new UnprocessableInputValueError("유효하지 않은 스타일 분류 입니다.", restBody)
    // 유효하지 않는 지역일 경우
    if (crewId === -4) throw new UnprocessableInputValueError("유효하지 않은 지역 입니다.", restBody)
    // 저장한 크루 ID를 이용해 신청서도 추가합니다.
    await createApplicationForm(body, crewId);
    // 배너 이미지를 S3에 업로드 한 다음 파일명만 잘라서 저장합니다.
    const bannerFileName = (await uploadBannerImage(body.bannerImage, crewId)).split('/').at(-1);
    // 크루 정보에 배너 이미지 파일명을 추가합니다.
    await updateCrewBanner(crewId, bannerFileName);
    // 크루 ID를 반환
    return responseFromCreateNewCrew({ crewId })
}