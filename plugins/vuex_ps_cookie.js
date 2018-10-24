import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import cookie from 'cookie'

// KJM 10/20/2018 NOTE: When including this plugin in the nuxt.config.js, 
// vuex automatically includes the createPersistedState function.... for some reason
// This way, you no longer get the duplicated localStorage objects (vuex AND vuexstate)
// You do NOT need to include this in the plugins property of the vuex store. Again, I don't know why.
// https://github.com/nuxt/nuxt.js/issues/972#issuecomment-372223633
export default ({store, req, isDev}) => {
    createPersistedState({
        key: 'vuexstate',
        reducer: (state) => {
            const state_filter = Object.assign({}, state)
            const black_list = ['error']

            black_list.forEach((item) => {
                delete state_filter[item]
            })

            return state_filter
        },
        storage: {
            getItem: (key) => {
                console.log('Calling getItem...')
                if (process.browser) {
                    console.log('Retrieving ' + key + ' on client side.')
                    return Cookies.getJSON(key)
                } 
                else {
                    console.log('Retrieving ' + key + ' on server side.')
                    return cookie.parse(req.headers.cookie || '')[key]
                }
                //process.browser ? Cookies.getJSON(key) : cookie.parse(req.headers.cookie || '')[key]
            }, 
            setItem: (key, value) => {
                //console.log('Set State Item - key: ' + key + ' value: ' + value)
                Cookies.set(key, value, { expires: 30, secure: !isDev })
            },
            removeItem: (key) => Cookies.remove(key)
        }
    })(store)
}