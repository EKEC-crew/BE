import { formatInTimeZone } from "date-fns-tz";

export const CrewPostListResponse = ({ posts, totalElements, totalPages, hasNext, pageNum, pageSize }) => {
	const items = posts.map(post => ({
		postId: post.id,
		title: post.title,
		createdAt: formatInTimeZone(post.createdAt, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
		nickname: post.crewMember.user.nickname,
		commentCount: post.commentCount,
		likeCount: post.likeCount,
		imageCount: post._count.crewPostImage,
		isPopular: post.isPopular,
	}));
	const response = {
		posts: items,
		totalElements: totalElements,
		totalPages: totalPages,
		hasNext: hasNext,
		pageNum: pageNum,
		pageSize: pageSize,
	}
	return response;
}

export const CrewPostResponse = ({ post, imagesInfo }) => {
	const response = {
		postId: post.id,
		title: post.title,
		content: post.content,
		createdAt: formatInTimeZone(post.createdAt, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
		nickname: post.crewMember?.user?.nickname,
		profileImage: post.crewMember?.user?.image,
		commentCount: post.commentCount,
		likeCount: post.likeCount,
		isPopular: post.isPopular,
		images: imagesInfo.map(image => ({
			imageId: image.id,
			imageName: image.imageName,
		})),
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

export const CrewCommentListResponse = ({ comments, totalElements, totalPages, hasNext, pageNum, pageSize }) => {
	const items = comments.map(comment => ({
		commentId: comment.id,
		content: comment.content,
		nickname: comment.crewMember.user.nickname,
		image: comment.crewMember.user.image,
		createdAt: formatInTimeZone(comment.createdAt, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
	}))
	const response = {
		comments: items,
		totalElements: totalElements,
		totalPages: totalPages,
		hasNext: hasNext,
		pageNum: pageNum,
		pageSize: pageSize,
	}

	return response;
}

export const CrewCommentResponse = (body) => {
	const comment = body;

	const response = {
		commentId: comment.id,
		content: comment.content,
		nickname: comment.crewMember.user.nickname,
		image: comment.crewMember.user.image,
		createdAt: formatInTimeZone(comment.createdAt, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
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