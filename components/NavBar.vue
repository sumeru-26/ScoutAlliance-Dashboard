<script setup>

    import { Button } from './ui/button';

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

    const { data, signOut } = useAuth()

    function logout() {
        // TODO: finish logout
        signOut({ callbackUrl: '/login' })
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
        <div class="w-full flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button class="my-5 mr-5">Account</Button>    
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{{ JSON.parse(data).user }}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span @click.stop.prevent="logout">Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
</template>