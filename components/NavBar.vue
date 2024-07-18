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



</script>

<template>
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
                <NuxtLink to="/login">
                    <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                        Login
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
</template>