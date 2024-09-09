import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
        
    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)

    const query = getQuery(event)
    const alliance = query.alliance
    const target = Number(query.target)
    
    const col = dbClient.db('dashboard').collection('alliance-invites')
    const targetInvite = await col.findOne({ 'team': team }, { projection: { _id: 0 } })
    if (targetInvite) {
        col.updateOne({ 'team': team }, { $pull: {
            invites:
                {
                    alliance: alliance,
                    team: target
                }
        }})
    }
    
})