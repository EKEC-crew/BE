import joinedRepository from '../repository/joined.repository.js';
import { crewListResponse } from '../dto/response/joined.response.dto.js';

const getMyJoined = async (userId) => {
    const rows = await joinedRepository.getMyJoined({ userId });

    return crewListResponse({ rows });
};

export default { getMyJoined };