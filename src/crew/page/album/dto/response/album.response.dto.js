export const CrewAlbumImagesResponse = (body) => {
    const response = body.map(imageInfo => ({
        albumId: imageInfo.id,
        imageName: imageInfo.image,
    }))

    return response;
}

export const CrewAlbumImageResponse = (body) => {
    const imageInfo = body;
    const response = {
        albumId: imageInfo.id,
        imageName: imageInfo.image,
    }

    return response;
}