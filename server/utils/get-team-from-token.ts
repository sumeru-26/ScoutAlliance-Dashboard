export default async function(token: string) {
    const sessionData = await $fetch('/api/auth/session', {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    return JSON.parse(sessionData).user
}