import { prisma } from "../../../../db.config.js";

export const getPostsByCrewId = async ({ crewId, page, size }) => {
	try {
		const popularPosts = await prisma.$queryRaw`
			SELECT *
			FROM crew_post
			WHERE crew_id = ${crewId}
				AND (like_count + comment_count) > 0
				AND created_at >= NOW() - INTERVAL 14 DAY
			ORDER BY (like_count + comment_count) DESC
			LIMIT 6
		`;
		const popularIds = popularPosts.map(post => post.id);

		await Promise.all(
			popularPosts.map(post =>
				prisma.crewPost.update({
					where: { id: post.id },
					data: { isPopular: true }
				})
			)
		);

		await prisma.crewPost.updateMany({
			where: {
				crewId,
				id: { notIn: popularIds },
				isPopular: true
			},
			data: {
				isPopular: false
			}
		});

		const postList = await prisma.crewPost.findMany({
			where: {
				crewId,
			},
			orderBy: [
				{ isPopular: 'desc' },
				{ createdAt: 'desc' },
			],
			skip: (page - 1) * size,
			take: size + 1,
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								id: true,
								nickname: true
							}
						}
					}
				},
				_count: {
					select: {
						crewPostImage: true,
					}
				}
			}
		});
		const totalElements = await prisma.crewPost.count({
			where: { crewId: crewId },
		})
		const totalPages = Math.ceil(totalElements / size);

		const hasNext = postList.length > size;
		const posts = postList.slice(0, size);
		const pageNum = page;
		const pageSize = posts.length;
		return { posts, totalElements, totalPages, hasNext, pageNum, pageSize };
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
		await prisma.crew.update({
			where: { id: crewId },
			data: {
				postCount: {
					increment: 1,
				}
			}
		});
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
								id: true,
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
		const crewId = deletedPost.crewId;
		await prisma.crew.update({
			where: { id: crewId },
			data: {
				postCount: {
					decrement: 1,
				}
			}
		});
		return deletedPost;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const addImage = async ({ postId, imageName }) => {
	try {
		const image = await prisma.crewPostImage.create({
			data: {
				imageName: imageName,
				postId: postId,
			}
		})
		return image;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const getImages = async ({ postId }) => {
	try {
		const images = await prisma.crewPostImage.findMany({
			where: { postId: postId }
		})
		return images;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const deleteUpdatedImages = async ({ postId, existingImageIds }) => {
	try {
		const deletedImages = await prisma.crewPostImage.findMany({
			where: {
				postId: postId,
				id: {
					notIn: existingImageIds.length > 0 ? existingImageIds : [0],
				}
			}
		})
		await prisma.crewPostImage.deleteMany({
			where: {
				postId: postId,
				id: {
					notIn: existingImageIds.length > 0 ? existingImageIds : [0],
				},
			},
		});
		return deletedImages;
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const deleteImages = async ({ postId }) => {
	try {
		const deletedImages = await prisma.crewPostImage.findMany({
			where: { postId: postId },
		})
		await prisma.crewPostImage.deleteMany({
			where: {
				postId: postId,
			}
		});
		return deletedImages;
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
			take: size + 1,
			include: {
				crewMember: {
					include: {
						user: {
							select: {
								id: true,
								nickname: true,
								image: true,
							}
						}
					}
				}
			}
		});
		const totalElements = await prisma.crewPostComment.count({
			where: { postId: postId }
		});
		const totalPages = Math.ceil(totalElements / size);
		const hasNext = commentList > size;
		const comments = commentList.slice(0, size);
		const pageNum = page;
		const pageSize = comments.length;
		return { comments, totalElements, totalPages, hasNext, pageNum, pageSize };
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
		if (!Number.isInteger(userId)) return null;
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
				},
				include: {
					crewMember: {
						select: {
							role: true,
							user: {
								select: {
									id: true
								}
							}
						}
					}
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
				},
				include: {
					crewMember: {
						select: {
							role: true,
						}
					},
					crewPost: {
						select: {
							crewId: true,
						}
					}
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

export const isExistImage = async ({ imageId }) => {
	try {
		const isExist = await prisma.crewPostImage.findUnique(
			{
				where: {
					id: imageId,
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

export const isExistImageInPost = async ({ postId, imageId }) => {
	try {
		const image = await prisma.crewPostImage.findUnique(
			{
				where: {
					id: imageId,
				}
			}
		)
		if (image.postId !== postId) {
			return false;
		} else {
			return true;
		}
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}

export const isExistLike = async ({ crewMemberId, postId }) => {
	try {
		if (!Number.isInteger(crewMemberId)) return null;
		const like = await prisma.crewPostLike.findFirst(
			{
				where: {
					crewMemberId: crewMemberId,
					postId: postId
				}
			}
		)
		if (like === null) return false;
		else return like.isLiked === 1 ? true : false
	} catch (err) {
		throw new Error(
			`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
		)
	}
}