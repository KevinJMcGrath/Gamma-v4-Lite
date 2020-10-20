//const path = require('path')
//const fs = require('fs')

require('dotenv').config()

module.exports = {
  telemetry: true,
  dev: (process.env.NODE_ENV !== 'production'),
  env: {
    // REMEMBER: variables here are replaced in the javascript verbatim
    // this is not a secure place to store keys or magic strings
    is_dev: process.env.NODE_ENV !== 'production',
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
    base_app_url: process.env.BASE_URL
  },
  loading: { color: '#3B8070' },
  css: [ 
    'assets/css/common.css',
    'assets/css/vue-tel-input-fixed.css',
    'vue-select/dist/vue-select.css',     
    'iview/dist/styles/iview.css'
  ],
  head: {
    title: '{{title}}',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '{{escape description }}' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }      
    ],
    script: [      
      { hid: 'stripe', src: 'https://js.stripe.com/v3/'},      
      //https://ionicons.com/
      { hid: 'ionicons', src: 'https://unpkg.com/ionicons@4.3.0/dist/ionicons.js'}
    ]
  },

  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certs/gamma-nuxt-express.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './certs/gamma-nuxt-express.crt'))
    }
  },
  
  router: {    
    middleware: ["phk"], 
    extendRoutes (routes, resolve) {
       routes.push({
        name: 'unknown',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }    
  },

  build: {
    extractCSS: true,
    extend (config, { isDev, isClient }) {

      if (isDev && isClient) {
        config.devtool = '#source-map'
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      config.module.rules.push({
        test: /\.vue$/,
        loader: 'iview-loader',
        options: {
          prefix: false
        }
      })

      config.module.rules.push({
        test: /\.(txt|pdf|ttf)$/,
        loader: 'file-loader',
        options: {}
      })
    }
  },

  //Working - 3/31/2018
  // ssr: false for components that require browser resources to work (client side components mostly)
  plugins: [
    { src: '~/plugins/iview.js', ssr: true},     
    { src: '~/plugins/qs_plugin.js', ssr: true}, 
    { src: '~/plugins/vuex_ps_cookie.js', ssr: true},
    { src: '~/plugins/vue-tele.js', ssr: false},
    { src: '~/plugins/vue-select.js', ssr: false}
  ],

  modules: [
    'nuxt-helmet',
    '@dansmaculotte/nuxt-segment',
    ['@nuxtjs/dotenv', {only: ['STRIPE_PUBLIC_KEY', 'CSOON']}]
  ],

  segment: {
    writeKey: process.env.SEGMENT_KEY,
    disabled: process.env.ADD_SEGMENT !== 'TRUE',
    useRouter: true
  }
}
