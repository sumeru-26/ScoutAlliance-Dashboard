<script setup>

    import { Hammer } from 'lucide-vue-next'

    definePageMeta({
        middleware: 'auth'
    })
    
</script>

<template>
    <header>
        <NavBar />
    </header>
    <h1 class="mx-5 text-lg font-semibold md:text-2xl">
        Home
    </h1>
    <div class="flex flex-row min-h-screen justify-center items-center">
        <p class="text-sm text-muted-foreground text-right">
            More features coming!
        </p>
        <Hammer class="h-4 w-4 text-muted-foreground flex justify-center mx-1" />
    </div>
</template>

