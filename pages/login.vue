<script setup>

    const router = useRouter()

    const userTemp = defineModel('userTemp')
    const keyTemp = defineModel('keyTemp')

    const user = useCookie(
        'user',
        // {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: true
        // }
    )
    const key = useCookie(
        'key',
        // {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: true
        // }
    )

    const loginFailed = ref(false)

    async function submit() {
         try {
            const passed = await $fetch('/api/ping-api', {
                method: 'GET',
                query: {
                    user: userTemp.value,
                    key: keyTemp.value
                }
            })
            if (passed == true) {
                //console.log('navigating')
                user.value = userTemp.value
                key.value = keyTemp.value
                router.push({ path: "/" })
            }
            else {
                handleLoginFailed()
            }
        } catch {
            handleLoginFailed()
        }
    }

    function handleLoginFailed() {
        console.log('login failed')
        loginFailed.value = true
    }

</script>

<template>
    <header>
        <NavBar />
        <h1>Login</h1>
    </header>
    <form>
        <label for="user">Team: </label>
        <input id="user" v-model="userTemp" type="text" aria-placeholder="Team Number">
        <label for="key">Key: </label>
        <input id="key" v-model="keyTemp" type="password" aria-placeholder="API Key">
        <button @click.stop.prevent="submit">Sign in</button>
    </form>
    <p v-if="loginFailed">login failed</p>

</template>