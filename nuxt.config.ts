// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'https://api.scoutalliance.live'
    },
  },
  devtools: { enabled: true },
})
