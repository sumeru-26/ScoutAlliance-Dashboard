import { defineEventHandler, H3Event, parseCookies } from 'h3'
import { ReturnDocument } from 'mongodb'

export default defineEventHandler(async (event: H3Event) => {
        
    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)

    const query = getQuery(event)
    const name = query.name
    const eventName = query.event
    
    const allianceCol = dbClient.db('security').collection('alliances')
    if (await allianceCol.findOne({ 'name': name, 'event': eventName }) === null) {
        allianceCol.insertOne({
            name: name,
            event: eventName,
            teams: [
                team
            ]
        })
        return true
    } else {
        return false
    }
    
    
})