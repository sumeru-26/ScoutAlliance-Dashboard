import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {

    const cookies = parseCookies(event)
    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)

    return fetch("https://api.frc-colors.com/v1/team/" + team)
    .then(response => response.json())
    
})