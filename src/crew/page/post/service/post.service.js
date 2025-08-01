import { } from "../../../../error.js";
import * as postResponse from "../dto/response/post.response.dto.js"
import * as postRepository from "../repository/post.repository.js"
import * as baseError from "../../../../error.js"
import * as s3Function from "../../../../utils/s3.js"

export const readPostsByCrew = async ({ crewId, page, size }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId })
		}
		const postList = await postRepository.getPostsByCrewId({ crewId, page, size });
		return postResponse.CrewPostListResponse(postList);
	} catch (err) {
		throw err;
	}
}

export const createCrewPost = async ({ userId, crewId, title, content, images }) => {
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
		const postId = post.id;
		const imagesInfo = [];
		for (const file of images) {
			const imageName = await s3Function.uploadToS3(file, 2);
			const image = await postRepository.addImage({ postId, imageName });
			imagesInfo.push(image);
		}

		return postResponse.CrewPostResponse({ post, imagesInfo });
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
		const imagesInfo = await postRepository.getImages({ postId });
		return postResponse.CrewPostResponse({ post, imagesInfo });
	} catch (err) {
		throw err;
	}
}

export const updateCrewPost = async ({ userId, crewId, postId, title, content, images, existingImageIds }) => {
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

		//존재하는 이미지 아이디가 맞는지 확인하기
		for (const imageId of existingImageIds) {
			const isExistImage = await postRepository.isExistImage({ imageId });
			if (!isExistImage) {
				throw new baseError.NotFoundImageError("존재하지 않는 이미지입니다.", { imageId });
			}
		}
		//existingImageIds에 남은 Id들이 해당 게시글의 이미지Id가 맞는지 확인하기
		for (const imageId of existingImageIds) {
			const isExistImageInPost = await postRepository.isExistImageInPost({ postId, imageId });
			if (!isExistImageInPost) {
				throw new baseError.NotExistImageInPostError("해당 게시글의 이미지가 아닙니다.", { imageId });
			}
		}

		//이미지 DB삭제 및 s3에서도 삭제
		const deletedImages = await postRepository.deleteUpdatedImages({ postId, existingImageIds });
		for (const deletedImage of deletedImages) {
			await s3Function.deleteFromS3(deletedImage.imageName, 2);
		}
		//수정에서 추가한 이미지 업로드 및 DB에도 업로드
		for (const file of images) {
			const imageName = await s3Function.uploadToS3(file, 2);
			await postRepository.addImage({ postId, imageName });
		}
		const imagesInfo = await postRepository.getImages({ postId });

		return postResponse.CrewPostResponse({ post, imagesInfo });
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

		const deletedImages = await postRepository.deleteImages({ postId });
		for (const deletedImage of deletedImages) {
			await s3Function.deleteFromS3(deletedImage.imageName, 2);
		}
		const imagesInfo = deletedImages;

		const post = await postRepository.removeCrewPostBypostId({
			postId,
		})

		return postResponse.CrewPostResponse({ post, imagesInfo });
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
export const readCommentsByCrewPost = async ({ crewId, postId, page, size }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new baseError.NotFoundCrewError("존재하지 않는 크루입니다.", { crewId });
		}
		const isExistPost = await postRepository.isExistPost({ postId });
		if (!isExistPost) {
			throw new baseError.NotFoundPostError("존재하지 않는 게시글입니다.", { postId });
		}

		const commentList = await postRepository.getCommentsByPostId({ postId, page, size });
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

export const deleteCrewPostComment = async ({ crewId, postId, userId, commentId }) => {
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
			postId,
		})

		return postResponse.CrewCommentResponse(comment);
	} catch (err) {
		throw err;
	}
}