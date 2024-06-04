<script setup>

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

    async function submit() {
        user.value = userTemp.value
        key.value = keyTemp.value
        await navigateTo('/')
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
        <button @click="submit">Sign in</button>
    </form>
</template>