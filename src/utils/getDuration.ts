interface IDuration {
    value: number
    suffix: string
}

export const getDuration = (startTime: number, endTime: number) => {
    let delta = Math.ceil(Math.abs(endTime - startTime) / 1000)

    const hour = Math.floor(delta / 3600) % 8
    delta -= hour * 3600

    const minute = Math.floor(delta / 60) % 60
    delta -= minute * 60

    const second = Math.floor(delta % 60)

    const duration = [
        {
            value: hour,
            suffix: hour > 1 ? 'hrs' : 'hr',
        },
        {
            value: minute,
            suffix: 'm',
        },
        {
            value: second,
            suffix: 's',
        },
    ]

    const formatDuration = (part: IDuration) => {
        const { value, suffix } = part

        if (value !== 0) {
            return `${value}${suffix}`
        }
    }

    return duration.map(formatDuration).join('')
}
