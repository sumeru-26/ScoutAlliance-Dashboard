<script setup>

    import { Hammer } from 'lucide-vue-next'

    definePageMeta({
        middleware: 'auth'
    })

    const user = useCookie('user')
    const key = useCookie('key')
</script>

<template>
    <header>
        <NavBar />
    </header>

    <div class="flex flex-row min-h-screen justify-center items-center">
        <p class="text-sm text-muted-foreground text-right">
            More features coming!
        </p>
        <Hammer class="h-4 w-4 text-muted-foreground flex justify-center mx-1" />
    </div>
</template>

