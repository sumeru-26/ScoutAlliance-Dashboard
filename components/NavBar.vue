<script setup>

    import {
        NavigationMenu,
        NavigationMenuContent,
        NavigationMenuItem,
        NavigationMenuLink,
        NavigationMenuList,
        NavigationMenuTrigger,
        navigationMenuTriggerStyle,
    } from '@/components/ui/navigation-menu'

    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu'

    import { Bot } from 'lucide-vue-next'

    const router = useRouter()

    const loaded = ref(false)
    const team = useCookie('user')

    const { data: rawData } = await useFetch('/api/team_colors')
    const teamColors = rawData._rawValue
    const primaryTeamColor = teamColors.primaryHex
    const secondaryTeamColor = teamColors.secondaryHex
    const iconBgClass = `rounded-full my-5 mr-5 bg-[${secondaryTeamColor}]`
    //const iconBgClass = `bg-[#277139] rounded-full`
    console.log(iconBgClass)
    loaded.value = true

    function logout() {
        const keyCookie = useCookie('key')
        team.value = null
        keyCookie.value = null
        router.push({ path: "/" })
    }
    

</script>

<template>
    <div class="bg-background flex">
        
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NuxtLink to="/">
                        <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                            Home
                        </NavigationMenuLink>
                    </NuxtLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NuxtLink to="/entries">
                        <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                            Entries
                        </NavigationMenuLink>
                    </NuxtLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        <div v-if="loaded" class="w-full flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div :class="iconBgClass">        
                        <Bot :color="primaryTeamColor" class="m-2" />
                    </div>    
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{{ team }}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span @click.stop.prevent="logout">Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
</template>