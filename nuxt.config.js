require('dotenv').config()

console.log(process.env.SFDC_BASE_URL)
console.log(process.env.SFDC_GAMMA_KEY)

module.exports = {  
  dev: (process.env.NODE_ENV !== 'production'),
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
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato|Roboto'},
      //{ rel: 'stylesheet', href: 'intl-tel-input/css/intlTelInput.css'},
      { rel: 'stylesheet', href: '/common.css'}
    ],
    script: [
      { hid: 'stripe', src: 'https://js.stripe.com/v3/'},
      //{ hid: 'intl-tel-input', src: 'intl-tel-input/js/intlTelInput.js'},
      //https://ionicons.com/
      { hid: 'ionicons', src: 'https://unpkg.com/ionicons@4.3.0/dist/ionicons.js'}
    ]
  },
  css: [
    '~/static/common.css'//,
    //'vue-tel-input/dist/vue-tel-input.css' //2
  ],

  loading: { color: '#3B8070' },

  build: {

    extractCSS: true,

    vendor: [
      'iview'//,
      //'vue-tel-input'      //1
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

      config.module.rules.push({
        test: /\.(txt|pdf|ttf)$/,
        loader: 'file-loader',
        options: {}
      })

    }
  },

  //Working - 3/31/2018
  plugins: [
    { src: '~/plugins/iview.js', ssr: true}//,
    //{ src: '~/plugins/vue-tele.js', ssr: true} //3
  ],

  modules: [
    ['@nuxtjs/dotenv', {only: ['SFDC_BASE_URL','GAMMA_DEBUG']}]
  ]
}
