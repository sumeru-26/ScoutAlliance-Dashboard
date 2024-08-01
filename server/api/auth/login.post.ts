export default defineEventHandler(async (event) => {
    
    const body = await readBody(event)
    console.log(JSON.stringify(body))
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

    console.log(JSON.stringify(data))

    if (!data) {
        throw createError({ statusCode: 403, statusMessage: 'Unauthorized' })
    }

    return {token: 'asdf'}


})