
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "stylesheet", href: "/fonts/font.css" }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
   ** router config
   */
  router: {
    middleware: ["i18n"]
  },
  /*
  ** Global CSS
  */
  css: [
    { src: "~assets/css/main.scss", lang: "scss" },
  ],
  /**
   * SSR
   */
  render: {
    ssr: false
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: "~/plugins/i18n", ssr: false }, // i18n initialize

    { src: "~/plugins/auxillary", ssr: false }, // Vue auxillary :)
    { src: "~/plugins/app-init", ssr: false } // Initialize local app
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
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
        maxAsyncRequests: 10
      }
    },

    splitChunks: {
      pages: true,
      vendor: true,
      commons: true,
      runtime: false,
      layouts: false
    },

    /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      config.node = {
        fs: "empty"
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
      config.resolve.alias["nuxt-class-component"] =
        "~/plugins/nuxt-class-component"
    }
  }
}
