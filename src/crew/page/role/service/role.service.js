import * as baseError from "../../../../error.js";
import * as roleRepository from "../repository/role.repository.js";
import * as roleResponse from "../dto/response/role.response.dto.js";

export const getMemberRole = async ({ userId, crewId }) => {
    try {
        const isExistCrew = await roleRepository.isExistCrew({ crewId });
        if (!isExistCrew) {
            throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
        }
        const crewMember = await roleRepository.findCrewMember({
            userId,
            crewId,
        })
        if (!crewMember) {
            throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
        }
        return roleResponse.MemberRoleResponse(crewMember);
    } catch (err) {
        throw err;
    }
}