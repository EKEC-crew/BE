import { prisma } from "../../../../db.config.js";

export const getPostsByCrewId = async ({ crewId }) => {
	try {
		const postList = await prisma.crewPost.findMany({
			where: {
				crewId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								nickname: true
							}
						}
					}
				}
			}
		});
		if (!postList || postList.length === 0) {
			throw new Error("게시글이 존재하지 않습니다.");
		}
		return postList;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const createCrewPost = async ({ crewMemberId, crewId, title, content }) => {
	try {
		const post = await prisma.crewPost.create({
			data: {
				title,
				content,
				commentCount: 0,
				createdAt: new Date(),
				crewId,
				crewMemberId: crewMemberId,
			}
		})
		return post;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const getPostByPostId = async ({ postId }) => {
	try {
		const post = await prisma.crewPost.findFirstOrThrow({
			where: {
				id: postId,
			},
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								nickname: true
							}
						}
					}
				}
			}
		})
		return post;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const updatePostBypostId = async ({ crewMemberId, postId, title, content }) => {
	try {
		const post = await prisma.crewPost.findUnique({
			where: {
				id: postId
			}
		})
		if (post.crewMemberId !== crewMemberId) {
			throw message('작성자가 아닙니다')
		}
		const updatedPost = await prisma.crewPost.update({
			where: {
				id: postId,
			},
			data: {
				title: title,
				content: content,
			}
		})
		return updatedPost;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const removeCrewPostBypostId = async ({ crewMemberId, postId }) => {
	try {
		const post = await prisma.crewPost.findUnique({
			where: {
				id: postId
			}
		})
		if (post.crewMemberId !== crewMemberId) {
			throw message('작성자가 아닙니다')
		}
		const deletedPost = await prisma.crewPost.delete({
			where: {
				id: postId,
			},
		})
		if (!deletedPost) {
			throw message('해당 게시글은 없습니다.')
		} else {
			return deletedPost
		}
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const likeCrewPost = async ({ crewMemberId, postId }) => {
	try {
		const post = await prisma.crewPost.findUnique({
			where: { id: postId },
		});

		const existingLiked = await prisma.crewPostLike.findUnique({
			where: {
				postId_crewMemberId: {
					crewMemberId: crewMemberId,
					postId: postId,
				}
			}
		})

		if (!existingLiked) {
			const newLikeCount = post.likeCount + 1;

			await prisma.crewPost.update({
				where: { id: postId },
				data: {
					likeCount: newLikeCount,
				},
			});

			const likeInfo = await prisma.crewPostLike.create({
				include: {
					crewPost: {
						select: {
							likeCount: true
						}
					}
				},
				data: {
					crewMemberId: crewMemberId,
					postId: postId,
				}
			})
			return likeInfo;
		} else {
			const toggledIsLiked = existingLiked.isLiked === 1 ? 0 : 1;
			const newLikeCount = toggledIsLiked === 1 ? post.likeCount + 1 : post.likeCount - 1;

			await prisma.crewPost.update({
				where: { id: postId },
				data: {
					likeCount: newLikeCount,
				},
			});

			const likeInfo = await prisma.crewPostLike.update({
				where: {
					postId_crewMemberId: {
						crewMemberId: crewMemberId,
						postId: postId,
					}
				},
				include: {
					crewPost: {
						select: {
							likeCount: true
						}
					}
				},
				data: {
					isLiked: toggledIsLiked,
				}
			})
			return likeInfo;
		}
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const findCrewMemberId = async ({ userId, crewId }) => {
	try {
		const isExist = await prisma.crewMember.findFirstOrThrow(
			{
				where: {
					userId: userId,
					crewId: crewId,
				}
			}
		)
		return isExist.id;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const isExistCrew = async ({ crewId }) => {
	try {
		const isExist = await prisma.crew.findUnique(
			{
				where: {
					id: crewId,
				}
			}
		)

		return !!isExist;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}