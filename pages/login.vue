<script setup>

    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button'

    const router = useRouter()

    const userTemp = defineModel('userTemp')
    const keyTemp = defineModel('keyTemp')
    const test = defineModel('test')

    const user = useCookie(
        'user',
        // {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: true
        // }
    )
    const key = useCookie(
        'key',
        // {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: true
        // }
    )

    const loginFailed = ref(false)

    async function submit() {
         try {
            const passed = await $fetch('/api/ping-api', {
                method: 'GET',
                query: {
                    user: userTemp.value,
                    key: keyTemp.value
                }
            })
            if (passed == true) {
                //console.log('navigating')
                user.value = userTemp.value
                key.value = keyTemp.value
                router.push({ path: "/" })
            }
            else {
                handleLoginFailed()
            }
        } catch {
            handleLoginFailed()
        }
    }

    function handleLoginFailed() {
        console.log('login failed')
        loginFailed.value = true
    }

</script>

<template>
    <header>
        <NavBar />
    </header>
    <div class="flex flex-row min-h-screen justify-center items-center">
        <Card class="w-full max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Login
                </CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="team">Team</Label>
                    <Input id="team" type="text" placeholder="Team Number" required v-model="userTemp" />
                </div>
                <div class="grid gap-2">
                    <Label for="key">Key</Label>
                    <Input id="key" type="password" required v-model="keyTemp" />
                </div>
            </CardContent>
            <CardFooter>
                <Button @click.stop.prevent="submit" class="w-full">
                    Sign in
                </Button>
            </CardFooter>
        </Card>
    </div>
</template>