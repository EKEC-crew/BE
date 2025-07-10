import { responseFromAdvancedSearch, responseFromDefaultSearch } from "../dto/response/search.response.dto.js";
import { findCrewsByName, findCrewsByOptions } from "../repository/search.repository.js";

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

export const crewDefaultSearch = async (data) => {
    const crews = await findCrewsByName(data);
    const filteredItems = formatCrewList(crews);
    return responseFromDefaultSearch(filteredItems);
}
export const crewAdvancedSearch = async (data) => {
    if (data.activity != undefined) data.activity = data.activity.split(',').map(item => parseInt(item));
    if (data.style != undefined) data.style = data.style.split(',').map(item => parseInt(item));
    const crews = await findCrewsByOptions(data);
    const filteredItems = formatCrewList(crews);
    return responseFromAdvancedSearch(filteredItems);
}