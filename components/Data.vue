<script setup>

    const { data: entries, error: err } = await useFetch('/api/data')

</script>

<template>
    <ul v-for="entry in entries" :key="entry" class="mx-5 border p-0 bg-primary-foreground first-of-type:rounded-t last-of-type:rounded-b">
        <p class="px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{{ entry }}</p>
    </ul>
</template>