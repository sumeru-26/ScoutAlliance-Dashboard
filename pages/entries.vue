<script setup>

    import { useToast } from '@/components/ui/toast/use-toast'
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuRadioGroup,
        DropdownMenuRadioItem,
        DropdownMenuTrigger
    } from '@/components/ui/dropdown-menu'
    import {
        Pagination,
        PaginationEllipsis,
        PaginationFirst,
        PaginationLast,
        PaginationList,
        PaginationListItem,
        PaginationNext,
        PaginationPrev,
    } from '@/components/ui/pagination'


    import { Plus, X, LoaderCircle, RefreshCcw, Frown, ChevronDown } from 'lucide-vue-next';

    useSeoMeta({
        title: 'Entries'
    })

    definePageMeta({
        middleware: 'auth'
    })

    const { toast } = useToast()

    const eventQuery = ref('')
    const matchQuery = ref('')
    const botQuery = ref('')
    const typeQuery = ref('')
    const dataQueries = ref([{field: '', value: '', index: 0}])

    let entries = ref()

    const loading = ref(true)

    const currentPageLocal = ref(1)
    const currentPageServer = ref(1)
    
    const entriesPerPage = ref(25)
    const totalNumberOfEntries = ref(0)

    const query = ref({})

    const { status, data: rawDBResults, refresh: refreshData, error: err } = await useLazyFetch('/api/data', {
        query: {
            page: currentPageServer,
            entriesPerPage: entriesPerPage,
            dbQuery: query
        },
        watch: false
    })

    watch(status, (newStatus, oldStatus) => {
        if (newStatus === 'success') {
            // let re = rawDBResults.value.entries().next().value[1].entries
            // console.log(rawDBResults.value.entries)
            // console.log(re)
            entries.value = rawDBResults.value.entries().next().value[1].entries // praying ts works
            totalNumberOfEntries.value = rawDBResults.value.entries().next().value[1].metadata[0].numEntries
            console.log(rawDBResults.value.entries().next().value[1])
            console.log(totalNumberOfEntries.value)
            loading.value = false
        }
    })

    watch(currentPageLocal, (newPage, _) => {
        // console.log(newPage)
        refreshDataWrapper()
    })

    function refreshDataWrapper() {
        // console.log('beginning refresh')
        loading.value = true
        currentPageServer.value = currentPageLocal.value
        refreshData().then( function() {
            loading.value = false
            // console.log('finished refresh')
        } )
        
    }

    function generateRequestQuery() {
            const tempQuery = {}
            for (const [key, value] of Object.entries({ 'metadata.event': eventQuery, 'metadata.match': matchQuery, 'metadata.bot': botQuery, 'metadata.type': typeQuery })) {
                if (value.value != '') {
                    if (!isNaN(value.value)) {
                        tempQuery[key] = +value.value // converts to int, mad sketchy tho
                    } else {
                        tempQuery[key] = value.value
                    }
                }
            }
            for (const q of dataQueries.value) {
                if (q.field != '') {
                    tempQuery.value[`data.${q.field}`] = q.value
                }
            }
        // console.log(query.value)
        query.value = tempQuery
    }
    
    function submitQuery() {
        generateRequestQuery()
        refreshDataWrapper()
    }

    // function queryFilter(entry) {

    //     if ((eventQuery.value != '' && entry.metadata.event != eventQuery.value)) {
    //         return false
    //     }

    //     if (matchQuery.value != '') {
    //         const matchQueryVal = parseInt(matchQuery.value)
    //         if (isNaN(matchQueryVal)) {
    //             toast({
    //                 description: 'Match # is not a real number',
    //             })
    //             return false
    //         }
    //         else if (entry.metadata.match != matchQueryVal) {
    //             return false
    //         }
    //     }

    //     if (botQuery.value != '') {
    //         const botQueryVal = parseInt(botQuery.value)
    //         if (isNaN(botQueryVal)) {
    //             toast({
    //                 description: 'Bot # is not a real number',
    //             })
    //             return false
    //         }
    //         else if (entry.metadata.bot != botQueryVal) {
    //             return false
    //         }
    //     }
        
    //     for (var query of dataQueries.value) {
    //         if (query.value == 'true' || query.value == 'false') query.value = (query.value === 'true')
    //         if (query.field != '' && query.value != '' && recursiveDataQueryFilter(entry, query.field, query.value) == false) {
    //             return false
    //         }
    //     }

    //     return true
        
    // }

    // function recursiveDataQueryFilter(entry, field, value) {
    //     if (!field.includes('.')) {
    //         return Object.hasOwn(entry, field) && entry[field] == value
    //     } else {
    //         const fieldSplit = field.split('.')
    //         if (Object.hasOwn(entry, fieldSplit[0])) {
    //             return recursiveDataQueryFilter(entry[fieldSplit[0]], field.substring(field.indexOf('.')+1), value)
    //         } else {
    //             return false
    //         }
    //     }
    // }

    // function addDataQuery() {
    //     dataQueries.value.push({field: '', value: '', index: dataQueries.value.length})
    //     reorderDataQueries()
    // }

    // function deleteDataQuery(index) {
    //     if (dataQueries.value.length > 1) {
    //         dataQueries.value.splice(index, 1)
    //         reorderDataQueries()
    //     } else {
    //         dataQueries.value = [{field: '', value: '', index: 0}]
    //     }
    // }

    // function reorderDataQueries() {
    //     var i = 0
    //     for (var q of dataQueries.value) {
    //         q.index = i
    //         i++
    //     }
    // }

</script>

<template>
    <header class="sticky top-0 z-10">
        <NavBar />
    </header>
    <h1 class="mx-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Entries
    </h1>
    <div class="m-5 border border-border rounded-lg">
        <div class="m-5 grid grid-cols-4 gap-2">
            <Input type="text" placeholder="Event (TBA Code)" v-model="eventQuery" />
            <Input type="text" placeholder="Match #" v-model="matchQuery" />
            <Input type="text" placeholder="Bot (Team #)" v-model="botQuery" />
            <Input type="text" placeholder="Type" v-model="typeQuery" />
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
            <div class="col-span-2 flex gap-2">
                <Button @click.stop.prevent="submitQuery()" class="mb-2 grow">Submit</Button>
                <Button @click.stop.prevent="refreshDataWrapper()" variant="outline" size="icon">
                    <RefreshCcw class="w-4 h-4" />
                </Button>
            </div>
        </div>
        <div class="mx-5 flex justify-center">
            <div class="">
                <Pagination v-model:page="currentPageLocal" :total="totalNumberOfEntries" :items-per-page="entriesPerPage" :sibling-count="1" show-edges>
                    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                    <PaginationFirst />
                    <PaginationPrev />

                    <template v-for="(item, index) in items">
                        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                        <Button class="w-10 h-10 p-0" :variant="item.value === currentPageLocal ? 'default' : 'outline'">
                            {{ item.value }}
                        </Button>
                        </PaginationListItem>
                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                    </template>

                    <PaginationNext />
                    <PaginationLast />
                    </PaginationList>
                </Pagination>
            </div>
            <div class="ml-5 flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline">
                            {{ entriesPerPage }}&nbsp;<ChevronDown class="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup v-model="entriesPerPage">
                            <DropdownMenuRadioItem value="10">
                                10
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="25">
                                25
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="50">
                                50
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="100">
                                100
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <!-- text input option too if we really want it -->
                <!-- <Input type="number" v-model="entriesPerPage" class="w-10" /> -->
                <div class="flex items-center">
                    <p>{{ (currentPageLocal-1)*entriesPerPage + 1 }} - {{ currentPageLocal*entriesPerPage }} of {{ totalNumberOfEntries }}</p>
                </div>
            </div>
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
        <div v-if="!loading && entries.length > 0" class="flex justify-center mb-5">
            <Pagination v-model:page="currentPageLocal" :total="totalNumberOfEntries" :items-per-page="entriesPerPage" :sibling-count="1" show-edges>
                <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                <PaginationFirst />
                <PaginationPrev />

                <template v-for="(item, index) in items">
                    <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                    <Button class="w-10 h-10 p-0" :variant="item.value === currentPageLocal ? 'default' : 'outline'">
                        {{ item.value }}
                    </Button>
                    </PaginationListItem>
                    <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>

                <PaginationNext />
                <PaginationLast />
                </PaginationList>
            </Pagination>
        </div>
    </div>
</template>