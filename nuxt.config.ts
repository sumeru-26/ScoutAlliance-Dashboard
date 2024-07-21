// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'https://api.scoutalliance.live'
    },
  },
  devtools: { enabled: true },
  css: [
    '~/assets/css/index.css',
    '~/assets/css/json-viewer.css',
  ],
  plugins: [
    '~/plugins/vue-json-pretty'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    'shadcn-nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  colorMode: {
    classSuffix: ''
  },
})