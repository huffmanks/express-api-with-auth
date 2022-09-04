const accessTokenPrivateKey = process.env['ACCESS_TOKEN_PRIVATE_KEY'] as string
const refreshTokenPrivateKey = process.env['REFRESH_TOKEN_PRIVATE_KEY'] as string
const accessTokenPublicKey = process.env['ACCESS_TOKEN_PUBLIC_KEY'] as string
const refreshTokenPublicKey = process.env['REFRESH_TOKEN_PUBLIC_KEY'] as string

const config = {
    accessTokenPrivateKey,
    refreshTokenPrivateKey,
    accessTokenPublicKey,
    refreshTokenPublicKey,
}

export default config
