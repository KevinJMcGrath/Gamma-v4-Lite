require('dotenv').config()

module.exports = {  
  dev: (process.env.NODE_ENV !== 'production'),
  env: {
    // REMEMBER: variables here are replaced in the javascript verbatim
    // this is not a secure place to store keys or magic strings
    is_dev: process.env.NODE_ENV !== 'production',
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
    base_app_url: process.env.BASE_URL,
    use_phk: process.env.USE_PHK,
    coming_soon: process.env.CSOON

  },
  loading: { color: '#3B8070' },
  css: [
    // Using my version of the CSS to fix the issues with the --border-radius
    // custom property warnings. 
    '~/static/vue-tel-input-fixed.css',
    'vue-select/dist/vue-select.css', // this seemed to have worked. Encouraging
    '~/static/common.css'
  ],
  head: {
    title: '{{title}}',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '{{escape description }}' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://unpkg.com/iview/dist/styles/iview.css'},
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato|Roboto:300,400'},
      { rel: 'stylesheet', href: '/common.css'}      
    ],
    script: [
      { hid: 'stripe', src: 'https://js.stripe.com/v3/'},      
      //https://ionicons.com/
      { hid: 'ionicons', src: 'https://unpkg.com/ionicons@4.3.0/dist/ionicons.js'}
    ]
  },
  
  router: {
    //middleware: ["https_redir", "const_redir"],
    middleware: ["const_redir"],
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
    vendor: [
      'iview',
      'vue-tel-input'
    ],

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

      // 8/12/2018 - KJM - Added this to hopefully fix the 
      // icon issue. Update: it didn't help. I'm using the 
      // font reference directly.
      // Having SVG in this caused my svg images to not load properly 
      // when specified as a local resource. Clearly I don't
      // understand this junk well enough. 
      /*config.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=10000',
        options: {}
      })*/
    }
  },

  //Working - 3/31/2018
  // ssr: false for components that require browser resources to work (client side components mostly)
  plugins: [
    { src: '~/plugins/iview.js', ssr: true},
    { src: '~/plugins/vue-tele.js', ssr: false}, 
    { src: '~/plugins/qs_plugin.js', ssr: true}, 
    { src: '~/plugins/vuex_ps_cookie.js', ssr: true},
    { src: '~/plugins/vue-select.js', ssr: false}
  ],

  modules: [
    ['@nuxtjs/dotenv', {only: ['STRIPE_PUBLIC_KEY']}]
  ]
}
