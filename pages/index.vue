<script setup>

    import { Hammer } from 'lucide-vue-next'

    useSeoMeta({
        title: 'Dashboard'
    })

    definePageMeta({
        middleware: 'auth'
    })
    
</script>

<template>
    <header>
        <NavBar />
    </header>
    <h1 class="mx-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Home
    </h1>
    <div class="flex flex-row min-h-screen justify-center items-center">
        <p class="text-sm text-muted-foreground text-right">
            More features coming!
        </p>
        <Hammer class="h-4 w-4 text-muted-foreground flex justify-center mx-1" />
    </div>
</template>

