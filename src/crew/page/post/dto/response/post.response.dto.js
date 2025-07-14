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