import { } from "../../../../error.js";
import * as postResponse from "../dto/response/post.response.dto.js"
import * as postRepository from "../repository/post.repository.js"

export const getPostsByCrew = async (crewId) => {
	try {
		const isExistCrew = postRepository.isExistCrew(crewId);
		if (!isExistCrew) {
			throw new Error;
		}
		const postList = await postRepository.getPostsByCrewId(crewId);
		return postResponse.CrewPostListResponse(postList);
	} catch (err) {
		throw err;
	}
}

export const addCrewPost = async (userId, crewId, data) => {
	try {
		const crewMemberId = await postRepository.findCrewMemberId({
			userId: userId,
			crewId: crewId,
		})
		const post = await postRepository.createCrewPost({
			crewMemberId: crewMemberId,
			crewId: crewId,
			title: data.title,
			content: data.content,
		})

		return postResponse.CrewPostResponse(post);
	} catch (err) {
		throw err;
	}
}

export const getCrewPost = async (data) => {

}

export const modifyCrewPost = async (data) => {

}

export const removeCrewPost = async (data) => {

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