<script setup>

    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button'
    import { useToast } from '@/components/ui/toast/use-toast'
    import { Toaster } from '@/components/ui/toast'

    import { LoaderCircle } from 'lucide-vue-next';

    const { signIn } = useAuth()

    const router = useRouter()

    const { toast } = useToast()

    const user = defineModel('userTemp')
    const key = defineModel('keyTemp')
    const test = defineModel('test')

    const userCookie = useCookie(
        'user',
        // {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: true
        // }
    )
    const keyCookie = useCookie(
        'key',
        // {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: true
        // }
    )

    const loading = ref(false)

    async function submit() {
        loading.value = true
         try {
            const passed = await $fetch('/api/verify', {
                method: 'GET',
                query: {
                    user: user.value,
                    key: key.value
                }
            })
            if (passed == true) {
                //console.log('navigating')
                userCookie.value = user.value
                keyCookie.value = key.value
                router.push({ path: "/" })
            }
            else {
                handleLoginFailed()
            }
        } catch {
            handleLoginFailed()
        }
        loading.value = false
    }

    function handleLoginFailed() {
        console.log('login failed')
        toast({
            description: 'Login failed: incorrect Team Number or Key',
            //variant: 'destructive',
            // for some weird reason, the red toast does not work
        })
        
    }

</script>

<template>
    <div class="flex flex-row min-h-screen justify-center items-center">
        <Card class="w-full max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Login
                </CardTitle>
                <CardDescription>
                    Enter your team number and key below.
                </CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="team">Team</Label>
                    <Input id="team" type="text" placeholder="Team Number" required v-model="user" />
                </div>
                <div class="grid gap-2">
                    <Label for="key">Key</Label>
                    <Input id="key" type="password" required v-model="key" />
                </div>
            </CardContent>
            <CardFooter>
                <Button @click.stop.prevent="signIn({ user, key })" class="w-full">
                    Sign in
                </Button>
            </CardFooter>
            <div class="flex justify-center mb-5">
                <LoaderCircle v-if="loading" class="animate-spin" />
            </div>                    
        </Card>
    </div>
    <Toaster />
</template>