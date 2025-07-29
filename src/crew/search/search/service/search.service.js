import { responseFromAdvancedSearch, responseFromDefaultSearch } from "../dto/response/search.response.dto.js";
import { findCrewsByName, findCrewsByOptions } from "../repository/search.repository.js";
/**
 * **[Crew Search]**
 * **\<Service | Util\>**
 * ***formatCrewList***
 * 레포지토리로 부터 반환된 검색 결과를 양식에 맞추어 재정의 하기 위한 유틸 함수 입니다.
 * @param {object} crews 
 * @returns 
 */
const formatCrewList = (crews) => {
    const result = crews.map(crew => ({
        id: crew.id,
        name: crew.title,
        description: crew.content,
        introduction: crew.introduction,
        capacity: crew.crewCapacity,
        createdAt: crew.createAt,
        noticeCount: crew.noticeCount,
        postCount: crew.postCount,
        bannerImage: crew.bannerImage,
        ageLimit: crew.ageLimit,
        genderLimit: crew.genderLimit,
        ownerName: crew.user.name,
        crewCategory: crew.crewCategory.content,
        crewActivity: crew.crewActivity.map(item => item.activity.content),
        crewStyle: crew.crewStyle.map(item => item.style.content),
        regionSido: crew.region.sido,
        regionGu: crew.region.goo,
    }));
    return result;
}
/**
 * **[Crew Search]**
 * **\<Service\>**
 * ***crewDefaultSearch***
 * '크루명으로 검색' 기능의 서비스 레이어 입니다. 레포지토리로 부터 검색결과를 가져오는 역할을 합니다.
 * @param {object} data 
 * @returns 
 */
export const crewDefaultSearch = async (data) => {
    // 입력된 정렬 기준에 맞추어 data 값 수정
    if (data.sort != undefined) {
        switch (data.sort) {
            case 1: // 최신 순 정렬
                data.sort = { createdAt: 'desc' };
                break;
            case 2: // 인기 순 정렬
                data.sort = { postCount: 'desc' };
                break;
            case 3: // 맴버 수 정렬 (오름차 순)
                data.sort = { crewCapacity: 'asc' };
                break;
            case 4: // 맴버 수 정렬 (내림차 순)
                data.sort = { crewCapacity: 'desc' };
                break;
        }
    }
    // 레포지토리로부터 검색 결과 가져오기
    const crews = await findCrewsByName(data);
    // 결과값 양식에 맞추어 정형화
    const filteredItems = formatCrewList(crews);
    // DTO 형식에 맞추어 컨트롤러로 반환
    return responseFromDefaultSearch(filteredItems);
}
/**
 * **[Crew Search]**
 * **\<Service\>**
 * ***crewAdvancedSearch***
 * '크루 찾아보기 (고급 검색)' 기능의 서비스 레이어 입니다. 레포지토리로 부터 검색결과를 가져오는 역할을 합니다.
 * @param {object} data 
 * @returns 
 */
export const crewAdvancedSearch = async (data) => {
    // 입력된 액티비티 값을 변환 (String => Array(Number))
    if (data.activity != undefined) data.activity = data.activity.split(',').map(item => parseInt(item));
    // 입력된 스타일 값을 변환 (String => Array(Number))
    if (data.style != undefined) data.style = data.style.split(',').map(item => parseInt(item));
    // 입력된 정렬 기준에 맞추어 data 값 수정
    if (data.sort != undefined) {
        switch (data.sort) {
            case 1: // 최신 순 정렬
                data.sort = { createdAt: 'desc' };
                break;
            case 2: // 인기 순 정렬
                data.sort = { postCount: 'desc' };
                break;
            case 3: // 맴버 수 정렬 (오름차 순)
                data.sort = { crewCapacity: 'asc' };
                break;
            case 4: // 맴버 수 정렬 (내림차 순)
                data.sort = { crewCapacity: 'desc' };
                break;
        }
    }
    // 레포지토리로부터 검색 결과 가져오기
    const crews = await findCrewsByOptions(data);
    // 결과값 양식에 맞추어 정형화
    const filteredItems = formatCrewList(crews);
    // DTO 형식에 맞추어 컨트롤러로 반환
    return responseFromAdvancedSearch(filteredItems);
}