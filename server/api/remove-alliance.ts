import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
        
    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)

    const query = getQuery(event)
    const alliance = query.alliance
    
    dbClient.db('security').collection('alliances').updateOne({ 'name': alliance }, { $pull: {
        teams: team
    }})
    
})