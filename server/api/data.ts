import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig(event)
    const cookies = parseCookies(event)
    const team = cookies?.user
    const col = dbClient.db('entries').collection(team)
    const dataCursor = await col.find({})
    return await dataCursor.toArray()
    
})