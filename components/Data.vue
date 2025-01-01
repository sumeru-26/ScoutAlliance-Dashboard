<script setup>

    import VueJsonPretty from 'vue-json-pretty';
    
    const props = defineProps(['entries'])

</script>

<template>
    <ul v-for="entry in props.entries" :key="entry" class="mx-5 border p-0 bg-primary-foreground first-of-type:rounded-t last-of-type:rounded-b">
        <div class="m-2">
            <vue-json-pretty
                :data="entry"
                :highlight-selected-node="false"
                :show-line="false"
                :show-icon="true"
            />
        </div>
    </ul>
</template>