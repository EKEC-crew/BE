export const readAlbumImagesRequest = (crewId) => {
    return {
        crewId: Number(crewId),
    };
}

export const createAlbumImageRequest = (userId, crewId, file) => {
    return {
        userId: Number(userId),
        crewId: Number(crewId),
        image: file,
    };
}