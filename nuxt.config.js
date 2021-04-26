const uiconfig = require('./config/uiconfig')

const scripts = [
  // For GTM Google Analytics
  {
    hid: 'gtm-script1',
    src: 'https://www.googletagmanager.com/gtag/js?id=G-W7PL7L7XJ8',
    defer: true,
  },
  {
    hid: 'gtm-script2',
    innerHTML: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-W7PL7L7XJ8');
    `,
    type: 'text/javascript',
    charset: 'utf-8',
  },
]

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Matic - Marketplace',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Matic - Marketplace',
      },
      { name: 'og:title', content: 'Matic - Marketplace' },
      { name: 'og:description', content: 'Matic - Marketplace' },
      { name: 'og:site_name', content: 'Matic - Marketplace' },
      { name: 'apple-mobile-web-app-title', content: 'Matic - Marketplace' },
      {
        hid: 'description',
        name: 'description',
        content: 'Matic - Marketplace',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/fonts/font.css' },
    ],
    script: scripts,
    __dangerouslyDisableSanitizers: ['script'], // to clean up url params in GTM Google Analytics script link
  },
  /*
   ** Environment variables
   */
  env: {
    uiconfig: JSON.stringify(uiconfig),
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** router config
   */
  router: {
    middleware: ['i18n'],
  },
  /*
   ** Global CSS
   */
  css: [{ src: '~assets/css/main.scss', lang: 'scss' }],
  /**
   * SSR
   */
  render: {
    ssr: false,
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/i18n', ssr: false }, // i18n initialize
    { src: '~/plugins/v-body-scroll-lock', ssr: false }, // Vue Body Scroll Lock initialize
    { src: '~/plugins/vue-tooltip', ssr: false }, // Adds v-tooltip prop

    { src: '~/plugins/auxillary', ssr: false }, // Vue auxillary :)
    { src: '~/plugins/app-init', ssr: false }, // Initialize local app
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/sentry',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    // extractCSS
    extractCSS: true,

    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 100000,
        maxSize: 3000000,
        maxAsyncRequests: 10,
      },
    },

    splitChunks: {
      pages: true,
      vendor: true,
      commons: true,
      runtime: false,
      layouts: false,
    },

    /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      config.node = {
        fs: 'empty',
      }

      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }

      // resolve nuxt-class-component
      config.resolve.alias['nuxt-class-component'] =
        '~/plugins/nuxt-class-component'
    },
  },

  sentry: {
    dsn: uiconfig.sentryDsn,
    config: {
      environment: uiconfig.matic.deployment.network,
      beforeSend: (sentryError) => {
        /**
         * Use this function to filter and stop sending
         * the error events that are not required
         * or does not belong to us
         */
        const errorMessage = sentryError?.exception?.values?.[0]?.value

        if (/jwplayer/gi.test(errorMessage)) {
          return null
        }

        return sentryError
      },
    },
  },
}
