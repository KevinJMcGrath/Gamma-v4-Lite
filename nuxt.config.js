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
      { hid: 'stripe', src: 'https://js.stripe.com/v3/'}//,
      //{ hid: 'intl-tel-input', src: 'intl-tel-input/js/intlTelInput.js'}
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
        test: /\.(txt|ttf|pdf)$/,
        loader: 'file-loader',
        options: {}
      })

    }
  },

  //Working - 3/31/2018
  plugins: [
    { src: '~/plugins/iview.js', ssr: true}//,
    //{ src: '~/plugins/vue-tele.js', ssr: true} //3
  ]
}
