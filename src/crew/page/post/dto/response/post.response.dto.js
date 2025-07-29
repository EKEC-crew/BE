export const CrewPostListResponse = (body) => {
	const response = body.map(post => ({
		postId: post.id,
		title: post.title,
		createdAt: post.createdAt,
		nickname: post.crewMember.user.nickname,
		commentCount: post.commentCount,
	}))

	return response;
}

export const CrewPostResponse = (body) => {
	const post = body;

	const response = {
		postId: post.id,
		title: post.title,
		content: post.content,
		createdAt: post.createdAt,
		nickname: post.crewMember?.user?.nickname,
		commentCount: post.commentCount,
	}

	return response;
}

export const likeCrewPostResponse = (body) => {
	const likeInfo = body;

	const response = {
		postId: likeInfo.postId,
		isLiked: likeInfo.isLiked == 1 ? true : false,
		likeCount: likeInfo.crewPost.likeCount,
	}

	return response;
}

export const CrewCommentListResponse = (body) => {
	const response = body.map(comment => ({
		commentId: comment.id,
		content: comment.content,
		nickname: comment.crewMember.user.nickname,
		createdAt: post.createdAt,
	}))

	return response;
}

export const CrewCommentResponse = (body) => {
	const comment = body;

	const response = {
		commentId: comment.id,
		content: comment.content,
		nickname: comment.crewMember.user.nickname,
		createdAt: post.createdAt,
	}

	return response;
}

export const CrewPostIdResponse = (body) => {
	const post = body;

	const response = {
		postId: post.id,
	}

	return response;
}