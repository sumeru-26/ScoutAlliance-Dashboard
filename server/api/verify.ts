import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const query = getQuery(event)
    try {    
        const team = parseInt(query.user) // this still works dw
        const key = query.key
        const keysCol = dbClient.db('security').collection('keys')
        const data = await keysCol.findOne({
            team: team,
            key: key
        })
        if (data) return true
    }
    catch {
        return false
    }
})