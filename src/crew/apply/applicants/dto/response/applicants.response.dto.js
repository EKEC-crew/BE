export const CrewApplicantListResponse = (applicants) => {
    return {
        totalCount: applicants.length,
        applicants: applicants.map((a) => ({
            applyId: a.id,
            nickname: a.user?.nickname || null,
            profileImage: a.user?.image || null,
            appliedAt: a.createdAt,
            status: a.status,
        })),
    };
};