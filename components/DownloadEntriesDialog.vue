<script setup>

    import csvjson from 'csvjson'

    import VueJsonPretty from 'vue-json-pretty';

    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from '@/components/ui/dialog'
    import { ScrollArea } from '@/components/ui/scroll-area'
    import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

    import { Download, LoaderCircle } from 'lucide-vue-next'

    const props = defineProps(['query'])

    const activeFileType = ref('json')

    const loading = ref(false)
    const badCSVQuery = ref(false)

    const entries = ref([])

    const csvString = ref('')
    const csvTableHeaders = ref([])
    const csvTableCells = ref([])

    function dialogOpenStatusResponse(isOpen) {
        // console.log(isOpen)
        if (isOpen) {
            loading.value = true
            badCSVQuery.value = false
            // console.log(props.query)
            $fetch('/api/data', {
                query: {
                    page: NaN,
                    entriesPerPage: NaN,
                    dbQuery: props.query
                },
            }).then((entriesRaw) => {
                // console.log(entriesRaw)
                entries.value = entriesRaw
                // console.log(entries.value)
                if (Object.hasOwn(props.query, 'metadata.event') && Object.hasOwn(props.query, 'metadata.type')) {
                    csvString.value = String(csvjson.toCSV(entries.value, { delimiter: ',', wrap: false })).replaceAll('[].', '')
                    // console.log(CSVString)
                    const csvLineSplit = csvString.value.split('\n')
                    csvTableHeaders.value = csvLineSplit[0].split(',')
                    csvTableCells.value = []
                    for (const line of csvLineSplit.slice(1, csvLineSplit.length)) {
                        csvTableCells.value.push(line.split(','))
                    }
                    // console.log(csvTableHeaders.value)
                    // console.log(csvTableCells.value)
                } else {
                    badCSVQuery.value = true
                }
                loading.value = false
            })
        }
    }

    function csvSelected() {
        activeFileType.value = 'csv'
    }

    function jsonSelected() {
        activeFileType.value = 'json'
    }

    function copyToClipboard() {
        if (activeFileType.value === 'json') {
            navigator.clipboard.writeText(JSON.stringify(entries.value))
        } else {
            navigator.clipboard.writeText(csvString.value)
        }
    }

    function downloadFile() {
        if (activeFileType.value === 'json') {
            // return base + Buffer.from(JSON.stringify(entries.value), 'base64')
            const URI = "data:text/json;charset=utf-8,"+JSON.stringify(entries.value)
            // console.log(URI)
            const link = document.createElement("a")
            link.setAttribute("href", encodeURI(URI))
            link.setAttribute("download", "data.json")
            document.body.appendChild(link)
            link.click()
        } else {
            const URI = "data:text/csv;charset=utf-8,"+csvString.value
            // console.log(URI)
            const link = document.createElement("a")
            link.setAttribute("href", encodeURI(URI))
            link.setAttribute("download", "data.csv")
            document.body.appendChild(link)
            link.click()
        }
    }

</script>

<template>
    <Dialog @update:open="(isOpen) => dialogOpenStatusResponse(isOpen)">
        <DialogTrigger as-child>
            <Button variant="outline">
                <Download class="w-4 h-4" />
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Download</DialogTitle>
                <DialogDescription>
                    Download entries in JSON or CSV (uses current set filter)
                </DialogDescription>
            </DialogHeader>
            <div v-if="loading" class="flex h-32 items-center justify-center mb-5">
                <LoaderCircle v-if="loading" class="animate-spin" />
            </div>
            <div v-else class="m-2 flex justify-center">
                <Tabs default-value="json" class="w-[400px]">
                    <TabsList class="grid w-full grid-cols-2">
                        <TabsTrigger value="json" @click.stop.prevent="jsonSelected()">
                            JSON
                        </TabsTrigger>
                        <TabsTrigger value="csv" @click.stop.prevent="csvSelected()">
                            CSV
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="json">
                        <ScrollArea class="mx-5 h-[200px] w-[400px] border p-0 bg-primary-foreground first-of-type:rounded-t last-of-type:rounded-b">
                            <!-- <div class="mx-5 border p-0 bg-primary-foreground first-of-type:rounded-t last-of-type:rounded-b"> -->
                                <div class="m-2">
                                    <vue-json-pretty
                                        :data="entries"
                                        :highlight-selected-node="false"
                                        :show-line="false"
                                        :show-icon="true"
                                    />
                                </div>
                            <!-- </div> -->
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="csv">
                        <Alert v-if="badCSVQuery" variant="destructive">
                            <AlertCircle class="w-4 h-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                The Event and Type fields must be set in the query in order to generate a CSV file.
                            </AlertDescription>
                        </Alert>
                        <div class="mx-5" v-else>
                            <ScrollArea class="h-[200px] w-[400px]">
                                <Table>
                                    <TableCaption>Entries</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead v-for="header in csvTableHeaders" :key="header">
                                                {{ header }}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow v-for="entry in csvTableCells" :key="entry">
                                            <TableCell v-for="value in entry" :key="value">
                                                {{ value }}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <DialogFooter>
                <div class="flex justify-end gap-2">
                    <Button variant="secondary" @click.stop.prevent="copyToClipboard()">
                        Copy As Text
                    </Button>
                    <Button variant="default" @click.stop.prevent="downloadFile()">
                        Download
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>