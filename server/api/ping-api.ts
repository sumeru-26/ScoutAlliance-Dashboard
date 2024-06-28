import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const query = getQuery(event)
    const team = query.user
    const key = query.key
    const response = await fetch(config.public.apiBase + "/", {
        method: "GET",
        headers: {
            "X-OS-Auth-Key": key
        }
    })
    const data = await response.json();
    if (response.status == 500 || // should be 422, api is buggin rn
        data.team != team
    ) {  
        return false
    }
    else {
        return true
    }
})