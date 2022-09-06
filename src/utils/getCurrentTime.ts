export const getCurrentTime = (expiresIn?: number) => {
    const date = new Date()

    if (expiresIn) return new Date(date.getTime() + expiresIn * 60000).toUTCString()

    return new Date(date.getTime()).toUTCString()
}
