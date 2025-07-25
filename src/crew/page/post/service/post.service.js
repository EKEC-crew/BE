import { } from "../../../../error.js";
import * as postResponse from "../dto/response/post.response.dto.js"
import * as postRepository from "../repository/post.repository.js"
import * as baseError from "../../../../error.js"

export const readPostsByCrew = async ({ crewId }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
		}
		const postList = await postRepository.getPostsByCrewId({ crewId });
		return postResponse.CrewPostListResponse(postList);
	} catch (err) {
		throw err;
	}
}

export const createCrewPost = async ({ userId, crewId, title, content }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
		}
		const crewMember = await postRepository.findCrewMember({
			userId,
			crewId,
		})
		if (!crewMember) {
			throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId })
		}
		const post = await postRepository.createCrewPost({
			crewMemberId: crewMember.id,
			crewId,
			title,
			content,
		})

		return postResponse.CrewPostResponse(post);
	} catch (err) {
		throw err;
	}
}

export const readCrewPost = async ({ crewId, postId }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
		}
		const isExistPost = await postRepository.isExistPost({ postId });
		if (!isExistPost) {
			throw new baseError.NotFoundPostError("존재하지 않는 게시글입니다.", { postId });
		}

		const post = await postRepository.getPostByPostId({ postId });
		return postResponse.CrewPostResponse(post);
	} catch (err) {
		throw err;
	}
}

export const updateCrewPost = async ({ userId, crewId, postId, title, content }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId });
		}
		const isExistPost = await postRepository.isExistPost({ postId });
		if (!isExistPost) {
			throw new baseError.NotFoundPostError("존재하지 않는 게시글입니다.", { postId });
		}
		const crewMember = await postRepository.findCrewMember({
			userId,
			crewId,
		})
		if (!crewMember) {
			throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
		}
		if (isExistPost.crewMemberId !== crewMember.id && crewMember.role !== 2) {
			throw new baseError.PermissionDeniedError("권한이 없는 유저입니다.", { userId });
		}

		const post = await postRepository.updatePostBypostId({
			postId,
			title,
			content,
		});
		return postResponse.CrewPostResponse(post);
	} catch (err) {
		throw err;
	}
}

export const deleteCrewPost = async ({ userId, crewId, postId }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId });
		}
		const isExistPost = await postRepository.isExistPost({ postId });
		if (!isExistPost) {
			throw new baseError.NotFoundPostError("존재하지 않는 게시글입니다.", { postId });
		}

		const crewMember = await postRepository.findCrewMember({
			userId,
			crewId,
		})
		if (!crewMember) {
			throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
		}
		if (isExistPost.crewMemberId !== userId && crewMember.role !== 2) {
			throw new baseError.PermissionDeniedError("권한이 없는 유저입니다.", { userId });
		}

		const post = await postRepository.removeCrewPostBypostId({
			postId,
		})

		return postResponse.CrewPostResponse(post);
	} catch (err) {
		throw err;
	}
}

export const toggleCrewPostLike = async ({ userId, crewId, postId }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId });
		}
		const isExistPost = await postRepository.isExistPost({ postId });
		if (!isExistPost) {
			throw new baseError.NotFoundPostError("존재하지 않는 게시글입니다.", { postId });
		}

		const crewMember = await postRepository.findCrewMember({
			userId,
			crewId,
		})
		if (!crewMember) {
			throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
		}
		const likeInfo = await postRepository.likeCrewPost({
			crewMemberId: crewMember.id,
			postId,
		})
		return postResponse.likeCrewPostResponse(likeInfo);
	} catch (err) {
		throw err;
	}
}
export const readCommentsByCrewPost = async ({ crewId, postId }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId });
		}
		const isExistPost = await postRepository.isExistPost({ postId });
		if (!isExistPost) {
			throw new baseError.NotFoundPostError("존재하지 않는 게시글입니다.", { postId });
		}

		const commentList = await postRepository.getCommentsByPostId({ postId });
		return postResponse.CrewCommentListResponse(commentList);
	} catch (err) {
		throw err;
	}
}
export const createCrewPostComment = async ({ crewId, postId, userId, content, isPublic }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId });
		}
		const isExistPost = await postRepository.isExistPost({ postId });
		if (!isExistPost) {
			throw new baseError.NotFoundPostError("존재하지 않는 게시글입니다.", { postId });
		}

		const crewMember = await postRepository.findCrewMember({
			userId,
			crewId,
		})
		if (!crewMember) {
			throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
		}

		const comment = await postRepository.addCrewPostComment({
			crewMemberId: crewMember.id,
			postId,
			content,
			isPublic
		})

		return postResponse.CrewCommentResponse(comment);
	} catch (err) {
		throw err;
	}
}
export const updateCrewPostComment = async ({ crewId, postId, userId, commentId, content, isPublic }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId });
		}
		const isExistPost = await postRepository.isExistPost({ postId });
		if (!isExistPost) {
			throw new baseError.NotFoundPostError("존재하지 않는 게시글입니다.", { postId });
		}
		const isExistComment = await postRepository.isExistComment({ commentId });
		if (!isExistComment) {
			throw new baseError.NotFoundCommentError("존재하지 않는 댓글입니다.", { commentId });
		}

		const crewMember = await postRepository.findCrewMember({
			userId,
			crewId,
		})
		if (!crewMember) {
			throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
		}
		if (isExistComment.crewMemberId !== crewMember.id && crewMember.role !== 2) {
			throw new baseError.PermissionDeniedError("권한이 없는 유저입니다.", { userId });
		}

		const comment = await postRepository.updateCommentByCommentId({
			commentId,
			content,
			isPublic,
		})

		return postResponse.CrewCommentResponse(comment);
	} catch (err) {
		throw err;
	}
}

export const deleteCrewPostComment = async ({ crewId, postId, userId, commentId, }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", "userId : " + { crewId });
		}
		const isExistPost = await postRepository.isExistPost({ postId });
		if (!isExistPost) {
			throw new baseError.NotFoundPostError("존재하지 않는 게시글입니다.", { postId });
		}
		const isExistComment = await postRepository.isExistComment({ commentId });
		if (!isExistComment) {
			throw new baseError.NotFoundCommentError("존재하지 않는 댓글입니다.", { commentId });
		}

		const crewMember = await postRepository.findCrewMember({
			userId,
			crewId,
		})
		if (!crewMember) {
			throw new baseError.NotCrewMemberError("크루 멤버에 속하지 않은 유저입니다.", { userId });
		}
		if (isExistComment.crewMemberId !== crewMember.id && crewMember.role !== 2) {
			throw new baseError.PermissionDeniedError("권한이 없는 유저입니다.", { userId });
		}

		const comment = await postRepository.removeCrewPostCommentByCommentId({
			commentId,
		})

		return postResponse.CrewCommentResponse(comment);
	} catch (err) {
		throw err;
	}
}