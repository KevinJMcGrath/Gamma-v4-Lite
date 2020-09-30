export default async function ({route, store, query, redirect, isDev}) {

    let phk_token = query != null && query.phk != null ? query.phk : ''
    let resp = await store.dispatch('verifyPHK', phk_token)
    
    if (!resp) {
        console.log('PHK invalid')
        redirect('https://www.symphony.com')
    }
   
}

    
