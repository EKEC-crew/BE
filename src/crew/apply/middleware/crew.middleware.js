import { prisma } from '../../../db.config.js';

/**
 * 크루장 권한 확인 미들웨어
 * 해당 크루에서 현재 사용자가 크루장(role=2)인지 확인
 */
export const checkCrewLeaderPermission = async (req, res, next) => {
    try {
        const { crewId } = req.params;
        const userId = req.payload.id; // authenticateAccessToken에서 설정된 사용자 정보

        // 해당 크루에서 이 사용자의 역할 확인
        const crewMember = await prisma.crewMember.findFirst({
            where: {
                userId: parseInt(userId),
                crewId: parseInt(crewId),
            },
            select: {
                role: true,
            },
        });

        // 크루 멤버가 아닌 경우
        if (!crewMember) {
            return res.status(403).json({
                resultType: 'FAIL',
                error: {
                    message: '해당 크루의 멤버가 아닙니다.',
                    code: 403,
                },
                success: null,
            });
        }

        // 크루장이 아닌 경우 (role !== 2)
        if (crewMember.role !== 2) {
            return res.status(403).json({
                resultType: 'FAIL',
                error: {
                    message: '크루장만 접근할 수 있습니다.',
                    code: 403,
                },
                success: null,
            });
        }

        // 크루장이면 다음 미들웨어로 진행
        next();
    } catch (error) {
        return res.status(500).json({
            resultType: 'FAIL',
            error: {
                message: '권한 확인 중 오류가 발생했습니다.',
                code: 500,
            },
            success: null,
        });
    }
};