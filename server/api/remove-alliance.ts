import { defineEventHandler, H3Event, parseCookies } from 'h3'
import { ReturnDocument } from 'mongodb'

export default defineEventHandler(async (event: H3Event) => {
        
    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)

    const query = getQuery(event)
    const alliance = query.alliance
    
    const newAlliance = await dbClient.db('security').collection('alliances').findOneAndUpdate({ 'name': alliance }, { $pull: {
        teams: team
    }}, { returnDocument: ReturnDocument.AFTER })
    if (newAlliance.teams.length == 0) {
        dbClient.db('security').collection('alliances').deleteOne({ 'name': alliance })
    }
    
})