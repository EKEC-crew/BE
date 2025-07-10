import {prisma} from "../../../../db.config.js";

export const getPostsByCrewId = async (crewId) => {
	try{
		const postList = await prisma.crewPost.findMany({
			where:{
				crewId: crewId,
			},
			orderBy:{
				createdAt: 'desc',
			}
		});
		if (!postList || postList.length === 0) {
			throw new Error("게시글이 존재하지 않습니다.");
		}
		console.log(postList);
		return postList;
	} catch(err){
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const createCrewPost = async ({crewMemberId, crewId, title, content}) => {
	try{
		const post = await prisma.crewPost.create({
			data:{
				title,
				content,
				commentCount: 0,
				createdAt: new Date(),
				crewId,
				crewMemberId: crewMemberId,
			}
		})
		return post;
	}catch (err){
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const findCrewMemberId = async({userId, crewId}) => {
	try{
		const isExist = await prisma.crewMember.findFirstOrThrow(
			{
				where:{
					userId: userId,
					crewId: crewId,
				}
			}
		)
		return isExist.id;
	}catch (err){
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}