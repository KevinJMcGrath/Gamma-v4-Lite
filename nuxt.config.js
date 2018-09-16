require('dotenv').config()

module.exports = {  
  dev: (process.env.NODE_ENV !== 'production'),
  env: {
    // REMEMBER: variables here are replaced in the javascript verbatim
    // this is not a secure place to store keys or magic strings
    is_dev: process.env.NODE_ENV !== 'production',
    stripe_public_key: 'pk_test_gUJYd9BdGY6XdYL9RltHkmRe'
  },
  loading: { color: '#3B8070' },
  css: [
    // Using my version of the CSS to fix the issues with the --border-radius
    // custom property warnings. 
    '~/static/vue-tel-input-fixed.css',
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
      { rel: 'stylesheet', href: 'https://unpkg.com/iview@2.11.0/dist/styles/iview.css'},
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato|Roboto:300,400'},
      { rel: 'stylesheet', href: '/common.css'}
    ],
    script: [
      { hid: 'stripe', src: 'https://js.stripe.com/v3/'},      
      //https://ionicons.com/
      { hid: 'ionicons', src: 'https://unpkg.com/ionicons@4.3.0/dist/ionicons.js'}
    ]
  },
  
  // Specifying custom routes to be included in the vue-router configuration
  // I'm not sure this is going to work exactly the way I want - it doesn't 
  // redirect the user... which is the say the URL in the omnibar doesn't change.
  router: {
    extendRoutes (routes, resolve) {
      // I created an index.vue with a redirect in the fetch() method instead.
      /*routes.push({
        name: 'root',
        path: '/',        
        component: resolve(__dirname, 'pages/email.vue')
        // redirect is coming in a later version
      }) */

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
  plugins: [
    { src: '~/plugins/iview.js', ssr: true},
    { src: '~/plugins/vue-tele.js', ssr: true} 
  ],

  modules: [
    ['@nuxtjs/dotenv', {only: ['SFDC_BASE_URL','GAMMA_DEBUG']}]
  ]
}
