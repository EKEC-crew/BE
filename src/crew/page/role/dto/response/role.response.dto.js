export const MemberRoleResponse = (member) => {
    const response = {
        memberId: member.id,
        role: member.role,
    }
    return response;
}