<script setup>

    definePageMeta({
        middleware: 'auth'
    })

    const user = useCookie('user')
    const key = useCookie('key')
</script>

<template>
    <header>
        <NavBar />
        <h1>ScoutAlliance Dashboard</h1>
    </header>
    <p>{{ user }} {{ key }}</p>
</template>