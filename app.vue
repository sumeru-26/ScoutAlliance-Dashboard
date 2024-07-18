<script setup>

  // required for displaying 'toast' dialogues (see https://www.shadcn-vue.com/docs/components/toast.html)
  import Toaster from '@/components/ui/toast/Toaster.vue'

  import { useColorMode } from '@vueuse/core'

  const mode = useColorMode()
  mode.value = 'dark'
  

</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
