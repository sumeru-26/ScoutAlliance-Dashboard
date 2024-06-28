import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig(event)
    const cookies = parseCookies(event)
    const key = cookies?.key
    return fetch(config.public.apiBase + "/entries/get", {
        method: "GET",
        headers: {
            "X-OS-Auth-Key": key
        }
    })
    .then(response => response.json())
})