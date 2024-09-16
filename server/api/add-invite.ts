import { timestamp } from '@vueuse/core'
import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
        
    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)

    const query = getQuery(event)
    const target = Number(query.target)
    const alliance = query.alliance

    if (await dbClient.db('security').collection('alliances').findOne({ "name": alliance }).then((teamAlliance) => {
        return !teamAlliance.teams.includes(team)
    })) {
        return
    }
    
    const col = dbClient.db('dashboard').collection('alliance-invites')
    const targetInvite = await col.findOne({ 'team': target }, { projection: { _id: 0 } })
    if (!targetInvite) {
        await col.insertOne({
            team: target,
            invites: [
                {
                    alliance: alliance,
                    team: team
                }
            ]
        })
    } else {
        for (var invite of targetInvite.invites) {
            if (invite.alliance == alliance) {
                col.updateOne(
                    { 'team': target },
                    { $set: { "invites.$[invite].timestamp": Date.now() } },
                    { arrayFilters: [ { "invite.alliance": alliance } ] }
                )
                return
            }
        }
        col.updateOne({ 'team': target }, { $push: {
            invites:
                {
                    alliance: alliance,
                    timestamp: Date.now()
                }
        }})
    }
    
})