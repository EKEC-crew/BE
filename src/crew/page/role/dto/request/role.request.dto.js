export const getMemberRoleRequest = (userId, crewId) => {
    return {
        userId: Number(userId),
        crewId: Number(crewId),
    }
}