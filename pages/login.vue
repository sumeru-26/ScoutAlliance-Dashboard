<script setup>

    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button'
    import { useToast } from '@/components/ui/toast/use-toast'
    import { Toaster } from '@/components/ui/toast'

    import { LoaderCircle } from 'lucide-vue-next';

    useSeoMeta({
        title: 'Login'
    })

    definePageMeta({
        auth: {
            unauthenticatedOnly: true,
            navigateAuthenticatedTo: '/'
        }
    })

    const { signIn } = useAuth()

    const router = useRouter()

    const { toast } = useToast()

    const user = ref('')
    const key = ref('')

    const loading = ref(false)

    async function submit() {
        
        try {
            await signIn({ user: user.value, key: key.value }, { callbackUrl: '/' })
        } catch (e) {
            handleLoginFailed()
        }
        
    
    }

    function handleLoginFailed() {
        toast({
            description: 'Login failed: incorrect Team Number or Key',
            variant: 'destructive'
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
                <Button @click.stop.prevent="submit()" class="w-full">
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