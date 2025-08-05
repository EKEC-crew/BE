import applicantsRepository from '../repository/applicants.repository.js';
import { CrewApplicantListResponse } from '../dto/response/applicants.response.dto.js';

const getApplicants = async ({ crewId }) => {
    const applicants = await applicantsRepository.getApplicantsByCrewId(crewId);
    return CrewApplicantListResponse(applicants);
};

export default { getApplicants };