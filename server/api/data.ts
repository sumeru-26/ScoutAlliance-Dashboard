import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
        
    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)
    
    const col = dbClient.db('entries').collection(`${team}`)
    const dataCursor = await col.find({})
    return await dataCursor.toArray()
    
})