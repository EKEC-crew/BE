import listRepository from '../repository/list.repository.js';
import { buildListResponse } from '../dto/response/list.response.dto.js';

const getMyPendingApplies = async (userId) => {
    const rows = await listRepository.findMyPendingApplies({ userId });

    return buildListResponse({ rows });
};

export default { getMyPendingApplies };