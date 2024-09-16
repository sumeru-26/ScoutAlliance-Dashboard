import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
        
    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)
    
    const alliances = await dbClient.db('security').collection('alliances').find({ teams: team }, { projection: { _id: 0 } })
    return await alliances.toArray()
    
})