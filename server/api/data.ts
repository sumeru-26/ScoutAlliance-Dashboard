import { defineEventHandler, H3Event, parseCookies, getRequestHeaders, getRequestHeader } from 'h3'
import { useRequestHeaders } from 'nuxt/app'

export default defineEventHandler(async (event: H3Event) => {
    
    const config = useRuntimeConfig(event)
    
    const cookies = parseCookies(event)
    const token = cookies['auth:token']

    const sessionData = await $fetch('/api/auth/session', {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    const team = JSON.parse(sessionData).user
    
    const col = dbClient.db('entries').collection(`${team}`)
    const dataCursor = await col.find({})
    return await dataCursor.toArray()
    
})