import { } from "../../../../error.js";
import * as postResponse from "../dto/response/post.response.dto.js"
import * as postRepository from "../repository/post.repository.js"


export const readPostsByCrew = async ({ crewId }) => {
	try {
		const isExistCrew = await postRepository.isExistCrew({ crewId });
		if (!isExistCrew) {
			throw new Error('존재하지 않는 크루입니다.');
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
			throw new Error('존재하지 않는 크루입니다.');
		}
		const crewMemberId = await postRepository.findCrewMemberId({
			userId,
			crewId,
		})
		const post = await postRepository.createCrewPost({
			crewMemberId,
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
			throw new Error('존재하지 않는 크루입니다.');
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
			throw new Error('존재하지 않는 크루입니다.');
		}
		const crewMemberId = await postRepository.findCrewMemberId({
			userId,
			crewId,
		})

		const post = await postRepository.updatePostBypostId({
			crewMemberId: crewMemberId,
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
			throw new Error('존재하지 않는 크루입니다.');
		}
		const crewMemberId = await postRepository.findCrewMemberId({
			userId,
			crewId,
		})

		const post = await postRepository.removeCrewPostBypostId({
			crewMemberId: crewMemberId,
			postId,
		})

		return postResponse.CrewPostResponse(post);
	} catch (err) {
		throw err;
	}
}

export const likeCrewPost = async (data) => {

}
export const getCommentsByCrewPost = async (data) => {

}
export const addCrewPostComment = async (data) => {

}
export const modifyCrewPostComment = async (data) => {

}

export const removeCrewPostComment = async (data) => {

}