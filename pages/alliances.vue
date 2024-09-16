<script setup>

    import { LoaderCircle, Plus, Check, X } from 'lucide-vue-next';

    const loadingInvites = ref(true)
    const loadingAlliances = ref(true)

    const invitedTeam = ref()

    const { status: inviteLoadStatus, data: invites, error: inviteLoadErr, refresh: refreshInvites } = await useLazyFetch('/api/get-invites')
    const { status: allianceLoadStatus, data: alliances, error: allianceLoadErr, refresh: refreshAlliances } = await useLazyFetch('/api/get-alliances')

    watch (inviteLoadStatus, (newStatus, oldStatus) => {
        if (newStatus === 'success') {
            loadingInvites.value = false
            console.log(invites.value)
        } else if (newStatus === 'pending') {
            loadingInvites.value = true
        }
    })
    watch (allianceLoadStatus, (newStatus, oldStatus) => {
        if (newStatus === 'success') {
            loadingAlliances.value = false
        } else if (newStatus === 'pending') {
            loadingAlliances.value = true
        }
    })

    async function addInvite() {
        await $fetch('/api/add-invite', {
            query: {
                alliance: 'test-alliance',
                target: invitedTeam.value
            }
        })
        await refreshInvites()
        await refreshAlliances()
    }

    async function acceptInvite(alliance) {
        await $fetch('/api/accept-invite', {
            query: {
                alliance: alliance,
            }
        })
        await refreshInvites()
        await refreshAlliances()
    }

    async function removeInvite(alliance) {
        await $fetch('/api/remove-invite', {
            query: {
                alliance: alliance,
            }
        })
        await refreshInvites()
    }

    async function removeAlliance(alliance) {
        await $fetch('/api/remove-alliance', {
            query: {
                alliance: alliance,
            }
        })
        await refreshAlliances()
    }

</script>

<template>
    <header class="sticky top-0 z-10">
        <NavBar />
    </header>
    <h1 class="mx-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Alliances
    </h1>
    <div class="grid grid-cols-2">
        <div class="m-5 border border-border rounded-lg h-min">
            <h3 class="mt-5 ml-5 scroll-m-20 text-2xl font-semibold tracking-tight">My Alliances</h3>
            <div v-if="loadingAlliances" class="flex h-32 items-center justify-center mb-5">
                <LoaderCircle class="animate-spin" />
            </div>
            <div v-else-if="alliances.length > 0">
                <ul v-for="alliance in alliances" :key="alliance">
                    <div class="grid grid-cols-2 m-5 border border-border rounded-lg">
                        <div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <h2 class="mt-2 ml-2 scroll-m-20 text-xl font-semibold tracking-tight">{{ alliance.name }}</h2>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{{ alliance.teams.toString().replace(',', ', ') }}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <p class="mb-2 ml-2 text-sm text-muted-foreground">{{ alliance.event }}</p>
                        </div>
                        <div class="m-2 flex space-x-2 justify-end items-center">
                            <Dialog>
                                <DialogTrigger>
                                    <Button variant="outline" size="icon">
                                        <Plus class="w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Invite Team</DialogTitle>
                                        <DialogDescription>
                                            Invite a team to "{{ alliance.name }}".
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Input type="number" placeholder="Team #" v-model="invitedTeam" />
                                    <DialogFooter>
                                        <DialogClose as-child>
                                            <Button @click.stop.prevent="addInvite()" type="button">
                                                Invite
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger>
                                    <Button variant="outline" size="icon">
                                        <X class="w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to leave "{{ alliance.name }}"?</DialogTitle>
                                        <DialogDescription>
                                            You will have to be reinvited to rejoin.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose as-child>
                                            <Button @click.stop.prevent="removeAlliance(alliance.name)" type="button" variant="destructive">
                                                Yes
                                            </Button>
                                            <Button type="button" variant="secondary">
                                                No
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </ul>
            </div>
            <div v-else class="flex justify-center">
                <p class="m-5 text-sm text-muted-foreground text-right">No alliances</p>
            </div>
        </div>
        <div class="m-5 border border-border rounded-lg h-min">
            <h3 class="mt-5 ml-5 scroll-m-20 text-2xl font-semibold tracking-tight">Invites</h3>
            <div v-if="loadingInvites" class="flex h-32 items-center justify-center mb-5">
                <LoaderCircle class="animate-spin" />
            </div>
            <div v-else-if="invites.length > 0">
                <ul v-for="invite in invites" :key="invite">
                    <div class="grid grid-cols-2 m-5 border border-border rounded-lg">
                        <div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <h2 class="mt-2 ml-2 scroll-m-20 text-xl font-semibold tracking-tight">{{ invite.name }}</h2>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{{ invite.teams.toString().replace(',', ', ') }}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <p class="mb-2 ml-2 text-sm text-muted-foreground">{{ invite.event }}</p>
                        </div>
                        <div class="m-2 flex space-x-2 justify-end items-center">
                            <Button @click.stop.prevent="acceptInvite(invite.name)" variant="outline" size="icon">
                                    <Check color="green" class="w-4 h-4" />
                            </Button>
                            <Button @click.stop.prevent="removeInvite(invite.name)" variant="outline" size="icon">
                                <X color="red" class="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </ul>
            </div>
            <div v-else class="flex justify-center">
                <p class="m-5 text-sm text-muted-foreground">No alliance invites</p>
            </div>
        </div>
    </div>
</template>