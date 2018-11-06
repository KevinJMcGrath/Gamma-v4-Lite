export default async function ({app, store, query, redirect, isDev}) {
    let force_redirect = false

    //console.log('running phk.js')

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

    
