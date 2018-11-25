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
            const black_list = ['error', 'global']

            black_list.forEach((item) => {
                delete state_filter[item]
            })

            return state_filter
        },
        storage: {
            getItem: (key) => {                
                if (process.browser) {                    
                    return Cookies.getJSON(key)
                } 
                else {                    
                    return cookie.parse(req.headers.cookie || '')[key]
                }
                
            }, 
            setItem: (key, value) => {
                //https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
                var inOneHour = 1/24
                Cookies.set(key, value, { expires: inOneHour, secure: !isDev })
            },
            removeItem: (key) => Cookies.remove(key)
        }
    })(store)
}