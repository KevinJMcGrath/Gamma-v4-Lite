import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
    createPersistedState({
        key: 'vuexstate',
        reducer: (state) => {
            const state_filter = Object.assign({}, state)
            const black_list = ['error']

            black_list.forEach((item) => {
                delete state_filter[item]
            })

            return state_filter
        }
    })(store)
}