<script setup>

    const { data: entries, error: err } = await useFetch('/api/data')

</script>

<template>
    <p>{{ entries }}</p>
</template>