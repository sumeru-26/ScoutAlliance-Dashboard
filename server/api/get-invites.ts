import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
        
    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)
    
    const col = dbClient.db('dashboard').collection('alliance-invites')
    const inviteObj = await col.findOne({ team: team }, { projection: { _id: 0 } })
    var allianceQueries = []
    for (var invite of inviteObj.invites) {
        allianceQueries.push({ name: invite.alliance })
    }
    if (allianceQueries.length == 0) {
        return []
    }
    const alliances = await dbClient.db('security').collection('alliances').find({ $or: allianceQueries }, { projection: { _id: 0 } })
    return await alliances.toArray()
    
})