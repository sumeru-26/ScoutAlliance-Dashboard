<script setup>

    import { useToast } from '@/components/ui/toast/use-toast'

    import { Plus, X, LoaderCircle, Frown } from 'lucide-vue-next';

    definePageMeta({
        middleware: 'auth'
    })

    const { toast } = useToast()

    const eventQuery = ref('')
    const matchQuery = ref('')
    const botQuery = ref('')
    const dataQueries = ref([{field: '', value: '', index: 0}])

    let entries = ref()

    const loading = ref(true)

    const { status, data: rawEntries, error: err } = await useLazyFetch('/api/data')

    watch(status, (newStatus, oldStatus) => {
        if (newStatus === 'success') {
            rawEntries.value.sort((a,b) => b.metadata.timestamp - a.metadata.timestamp)
            entries.value = rawEntries.value
            loading.value = false
        }
    })
    
    function submitQuery() {

        entries.value = rawEntries.value.filter((entry) => queryFilter(entry))
    }

    function queryFilter(entry) {

        if ((eventQuery.value != '' && entry.metadata.event != eventQuery.value)) {
            return false
        }

        if (matchQuery.value != '') {
            const matchQueryVal = parseInt(matchQuery.value)
            if (isNaN(matchQueryVal)) {
                toast({
                    description: 'Match # is not a real number',
                })
                return false
            }
            else if (entry.metadata.match != matchQueryVal) {
                return false
            }
        }

        if (botQuery.value != '') {
            const botQueryVal = parseInt(botQuery.value)
            if (isNaN(botQueryVal)) {
                toast({
                    description: 'Bot # is not a real number',
                })
                return false
            }
            else if (entry.metadata.bot != botQueryVal) {
                return false
            }
        }
        
        for (var query of dataQueries.value) {
            if (query.value == 'true' || query.value == 'false') query.value = (query.value === 'true')
            if (query.field != '' && query.value != '' && recursiveDataQueryFilter(entry, query.field, query.value) == false) {
                return false
            }
        }

        return true
        
    }

    function recursiveDataQueryFilter(entry, field, value) {
        if (!field.includes('.')) {
            return Object.hasOwn(entry, field) && entry[field] == value
        } else {
            const fieldSplit = field.split('.')
            if (Object.hasOwn(entry, fieldSplit[0])) {
                return recursiveDataQueryFilter(entry[fieldSplit[0]], field.substring(field.indexOf('.')+1), value)
            } else {
                return false
            }
        }
    }

    function addDataQuery() {
        dataQueries.value.push({field: '', value: '', index: dataQueries.value.length})
        reorderDataQueries()
    }

    function deleteDataQuery(index) {
        if (dataQueries.value.length > 1) {
            dataQueries.value.splice(index, 1)
            reorderDataQueries()
        } else {
            dataQueries.value = [{field: '', value: '', index: 0}]
        }
    }

    function reorderDataQueries() {
        var i = 0
        for (var q of dataQueries.value) {
            q.index = i
            i++
        }
    }

</script>

<template>
    <header class="sticky top-0 z-10">
        <NavBar />
    </header>
    <h1 class="mx-5 text-lg font-semibold md:text-2xl">
        Entries
    </h1>
    <div class="m-5 border border-border rounded-lg">
        <div class="m-2 grid grid-cols-3 gap-2">
            <Input type="text" placeholder="Event (use TBA event key, e.g. &quot;2024cmptx&quot;)" v-model="eventQuery" />
            <Input type="text" placeholder="Match #" v-model="matchQuery" />
            <Input type="text" placeholder="Bot (Team #)" v-model="botQuery" />
            <div class="col-span-2">
                <ul v-for="query in dataQueries" :key="query">
                    <div class="mb-2 flex gap-2">
                        <div class="flex-auto grid grid-cols-2 gap-2">
                            <Input type="text" placeholder="field (e.g. 'data.points')" v-model="query.field" />
                            <Input type="text" placeholder="value" v-model="query.value" />
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="icon" @click.stop.prevent="addDataQuery()">
                                <Plus class="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" @click.stop.prevent="deleteDataQuery(query.index)">
                                <X class="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </ul>
            </div>
            <Button @click.stop.prevent="submitQuery()" class="mb-2">Submit</Button>
        </div>
        <div v-if="loading" class="flex h-32 items-center justify-center mb-5">
            <LoaderCircle v-if="loading" class="animate-spin" />
        </div>
        <div v-else-if="entries.length > 0" class="my-5">
            <Data :entries="entries" />
        </div>
        <div v-else class="flex flex-row h-32 justify-center items-center">
            <p class="text-sm text-muted-foreground text-right">
                No results
            </p>
            <Frown class="h-4 w-4 text-muted-foreground flex justify-center mx-1" />
        </div>
    </div>
</template>