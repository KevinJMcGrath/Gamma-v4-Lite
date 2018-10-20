import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import cookie from 'cookie'

// KJM 10/20/2018 NOTE: When including this plugin in the nuxt.config.js, 
// vuex automatically includes the createPersistedState function.... for some reason
// This way, you no longer get the duplicated localStorage objects (vuex AND vuexstate)
// You do NOT need to include this in the plugins property of the vuex store. Again, I don't know why.
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
            getItem: (key) => process.browser ? Cookies.getJSON(key) : cookie.parse(req.headers.cookie || '')[key],
            setItem: (key, value) => Cookies.set(key, value, { expires: 30, secure: !isDev }),
            removeItem: (key) => Cookies.remove(key)
        }
    })(store)
}