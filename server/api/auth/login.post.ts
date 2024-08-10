import * as jose from 'jose'

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig()
    
    const body = await readBody(event)
    let team = 0
    try {
        team = parseInt(body.user)
    } catch {
        throw createError({ statusCode: 403, statusMessage: 'Invalid Team Name' })
    }
    const key = body.key

    const keysCol = dbClient.db('security').collection('keys')
    const data = await keysCol.findOne({
        team: team,
        key: key
    })


    if (!data) {
        throw createError({ statusCode: 403, statusMessage: 'Unauthorized' })
    }

    const expiresIn = 15
    const payload = { user: team }

    const secret = new TextEncoder().encode(config.jwtSecretKey)

    //const accessToken = sign(payload, config.jwtSecretKey, { expiresIn })

    const accessToken = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15 min')
        .sign(secret)

    return { token: accessToken }

})