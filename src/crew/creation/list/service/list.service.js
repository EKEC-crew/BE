import listRepository from '../repository/list.repository.js';
import { buildMyCrewsResponse } from '../dto/response/list.response.dto.js';

const getMyCrews = async (userId) => {
    const rows = await listRepository.findMyCrews({ userId });

    return buildMyCrewsResponse({ rows });
};

export default { getMyCrews };