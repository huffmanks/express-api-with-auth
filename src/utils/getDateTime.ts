const currentDate = new Date()

export const getDate = (expiresIn?: number) => {
    if (expiresIn) return new Date(currentDate.getTime() + expiresIn * 60 * 1000)

    return currentDate
}

export const getTimestamp = () => {
    return Math.ceil(currentDate.getTime() / 1000)
}
