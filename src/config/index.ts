const port = process.env['PORT'] as string
const dbUri = process.env['DB_URI'] as string
const accessTokenExpires = process.env['ACCESS_TOKEN_EXPIRES'] as string
const refreshTokenExpires = process.env['REFRESH_TOKEN_EXPIRES'] as string
const accessTokenPrivateKey = process.env['ACCESS_TOKEN_PRIVATE_KEY'] as string
const refreshTokenPrivateKey = process.env['REFRESH_TOKEN_PRIVATE_KEY'] as string
const accessTokenPublicKey = process.env['ACCESS_TOKEN_PUBLIC_KEY'] as string
const refreshTokenPublicKey = process.env['REFRESH_TOKEN_PUBLIC_KEY'] as string

const config = {
    port,
    dbUri,
    accessTokenExpires,
    refreshTokenExpires,
    accessTokenPrivateKey,
    refreshTokenPrivateKey,
    accessTokenPublicKey,
    refreshTokenPublicKey,
}

export default config
