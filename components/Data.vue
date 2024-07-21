<script setup>

    import VueJsonPretty from 'vue-json-pretty';

     const depth = ref(2)

    const { data: entries, error: err } = await useFetch('/api/data')

</script>

<template>
    <ul v-for="entry in entries" :key="entry" class="mx-5 border p-0 bg-primary-foreground first-of-type:rounded-t last-of-type:rounded-b">
        <vue-json-pretty
            :data="entry"
            :deep="depth"
            :highlight-selected-node="false"
            :show-line="false"
            :show-icon="true"
        />
    </ul>
</template>