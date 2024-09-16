import { defineEventHandler, H3Event, parseCookies } from 'h3'
import { QueryValue } from 'ufo'

export default defineEventHandler(async (event: H3Event) => {
        
    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)

    const query = getQuery(event)
    const alliance = query.alliance
    
    const invitesCol = dbClient.db('dashboard').collection('alliance-invites')
    const alliancesCol = dbClient.db('security').collection('alliances')
    const targetInvite = await invitesCol.findOne({ 'team': team }, { projection: { _id: 0 } })
    if (targetInvite && targetInvite.invites.some(function (invite: { alliance: string }) {
        return invite.alliance === alliance
    }) && await alliancesCol.findOne({ 'name': alliance }).then((alliance) => {
            return !alliance.teams.includes(team)
        })) {
        alliancesCol.updateOne({'name': alliance}, { $push: {
            teams: team
        }})
    }

    invitesCol.updateOne({'team': team}, { $pull: {
        invites: {
            alliance: alliance,
        }
    }})
    
})