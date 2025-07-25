import { getPopularCrews, getLatestCrews } from "../repository/list.repository.js";
import { mapCrewToResponse } from "../dto/response/list.response.dto.js";

async function getPopularCrewList() {
    const crews = await getPopularCrews();
    return crews.map(mapCrewToResponse);
}

async function getLatestCrewList() {
    const crews = await getLatestCrews();
    return crews.map(mapCrewToResponse);
}

export {
    getPopularCrewList,
    getLatestCrewList
};
