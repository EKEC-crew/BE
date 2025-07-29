import { prisma } from "../../../../db.config.js";

export const getPostsByCrewId = async ({ crewId, page, size }) => {
	try {
		const postList = await prisma.crewPost.findMany({
			where: {
				crewId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			skip: (page - 1) * size,
			take: size,
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
			},
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								nickname: true,
								image: true,
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
								nickname: true,
								image: true,
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

export const updatePostBypostId = async ({ postId, title, content }) => {
	try {
		const updatedPost = await prisma.crewPost.update({
			where: {
				id: postId,
			},
			data: {
				title: title,
				content: content,
			},
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								nickname: true,
								image: true,
							}
						}
					}
				}
			}
		})
		return updatedPost;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const removeCrewPostBypostId = async ({ postId }) => {
	try {
		const deletedPost = await prisma.crewPost.delete({
			where: {
				id: postId,
			},
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								nickname: true,
								image: true,
							}
						}
					}
				}
			}
		})
		return deletedPost;
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

//크루 게시글 댓글 관련

export const getCommentsByPostId = async ({ postId, page, size }) => {
	try {
		const commentList = await prisma.crewPostComment.findMany({
			where: {
				postId: postId,
			},
			orderBy: {
				createdAt: 'asc',
			},
			skip: (page - 1) * size,
			take: size,
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								nickname: true,
								image: true,
							}
						}
					}
				}
			}
		})
		return commentList;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}
export const addCrewPostComment = async ({ crewMemberId, postId, content, isPublic }) => {
	try {
		const comment = await prisma.crewPostComment.create({
			data: {
				content: content,
				isPublic: isPublic,
				crewMemberId: crewMemberId,
				postId: postId,
			},
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								nickname: true,
								image: true,
							}
						}
					}
				}
			}
		})
		await prisma.crewPost.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } });
		return comment;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const updateCommentByCommentId = async ({ commentId, content, isPublic }) => {
	try {
		const comment = await prisma.crewPostComment.update({
			where: {
				id: commentId,
			},
			data: {
				content: content,
				isPublic: isPublic,
			},
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								nickname: true,
								image: true,
							}
						}
					}
				}
			}
		})

		return comment;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const removeCrewPostCommentByCommentId = async ({ commentId, postId }) => {
	try {
		const comment = await prisma.crewPostComment.delete({
			where: {
				id: commentId,
			},
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								nickname: true,
								image: true,
							}
						}
					}
				}
			}
		})
		await prisma.crewPost.update({ where: { id: postId }, data: { commentCount: { decrement: 1 } } });
		return comment;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

// 유저 아이디로 크루멤버아이디 찾기(인증)
export const findCrewMember = async ({ userId, crewId }) => {
	try {
		const crewMember = await prisma.crewMember.findFirst(
			{
				where: {
					userId: userId,
					crewId: crewId,
				}
			}
		)
		return crewMember;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

// 비즈니스 유효성 검사

export const isExistCrew = async ({ crewId }) => {
	try {
		const isExist = await prisma.crew.findUnique(
			{
				where: {
					id: crewId,
				}
			}
		)

		return isExist;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const isExistPost = async ({ postId }) => {
	try {
		const isExist = await prisma.crewPost.findUnique(
			{
				where: {
					id: postId,
				}
			}
		)
		return isExist;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const isExistComment = async ({ commentId }) => {
	try {
		const isExist = await prisma.crewPostComment.findUnique(
			{
				where: {
					id: commentId,
				}
			}
		)

		return isExist;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}