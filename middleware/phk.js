export default async function ({store, query, redirect, isDev}) {
    if (!isDev) {
        if (query.phk) {
            let resp = await store.dispatch('verifyPHK', query.phk)
            console.log('PHK Response: ' + JSON.stringify(resp))
            if (resp) {
                console.log('PHK verified')
            }
            else {
                console.log('PHK invalid')
                redirect('https://www.symphony.com')
            }
        }
        else {
            console.log('PHK missing')
            redirect('https://www.symphony.com')
        }
    }
    else {
        console.log('Dev: bypassing PHK check')
    }
    
}