export default async function ({app, env, store, query, redirect, isDev}) {
    

    if (env.use_phk) {
        
        let force_redirect = false

        if (query.phk) {
            let resp = await store.dispatch('verifyPHK', query.phk)
            
            if (!resp) {
                console.log('PHK invalid')
                force_redirect = true
            }
        }
        else {
            console.log('PHK missing')
            force_redirect = true
        }

        if (force_redirect) {
            if (!isDev) {
                redirect('https://www.symphony.com')
            }
            else {
                console.log('Dev bypass of phk redirect')
            }
            
        }
    }
}

    
