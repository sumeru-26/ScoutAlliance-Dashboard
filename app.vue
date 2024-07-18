<script setup>

  import { useColorMode } from '@vueuse/core'

  const mode = useColorMode()
  mode.value = 'dark'
  

</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
