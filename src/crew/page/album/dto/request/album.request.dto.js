export const readAlbumImagesRequest = (crewId) => {
    return {
        crewId: Number(crewId),
    };
}

export const createAlbumImageRequest = (crewId, body, file) => {
    return {
        crewId: Number(crewId),
        userId: Number(body.userId),
        image: file,
    };
}