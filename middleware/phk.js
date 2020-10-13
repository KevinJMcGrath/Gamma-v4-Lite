export default async function ({route, store, query, redirect, isDev}) {
    if (!isDev) {
        let phk_token = query != null && query.phk != null ? query.phk : ''        

        if (phk_token) {
            store.commit('SET_PHK', phk_token)
        }
        
        if (!route.name || route.name === 'unknown' || route.name === 'index') {
            console.log('Skipping PHK redirect by route name...')
        } else {
            
            let phk_verified = await store.dispatch('verifyPHK', phk_token)

            if (!phk_verified) {
                console.log('PHK invalid')
                redirect('https://www.symphony.com')
            }
        }
    }

        
   
}

    
