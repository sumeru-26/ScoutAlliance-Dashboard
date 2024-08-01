export default defineNuxtRouteMiddleware((to, from) => {
    if (isAuthenticated() === false) {
        return navigateTo('/login')
    }
})

function isAuthenticated() {
    const user = useCookie('user')
    const key = useCookie('key')
    console.log("user: " + user.value)
    console.log("key: " + key.value)
    return user.value !== undefined //&& key.value !== undefined
}