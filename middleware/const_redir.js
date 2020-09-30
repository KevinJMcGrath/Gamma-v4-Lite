export default function ({route, redirect}) {

    /*try {
        console.log('ENV list:')
        console.log('server side: ' + process.server)
        console.log('client side: ' + process.client)
        console.log(process.env.DEPLOY_TYPE)        
        console.log(process.env.SFDC_GAMMA_KEY)
        console.log(process.env.SFDC_BASE_URL)
        console.log(process.env.BASE_URL)
        console.log(process.env.STRIPE_PUBLIC_KEY)
        console.log(process.env.PHK_CHECK_KEY)
        console.log(process.env.USE_PHK)
        console.log(process.env.CSOON)
    } catch(error) {
        console.log(error)
    }*/
    const pages = ['index', 'error', 'coming-soon', 'unknown']

    // ENV are not typed, they are parsed as strings
    let csoon_check = process.env.CSOON == 'TRUE'    

    if (csoon_check && (!route.name || !pages.includes(route.name)) )
    {
        console.log('Force const_redir redirect for route: ' + route.name)
        //redirect('/coming-soon')
    } else {
        console.log('Skipping const_redir for route: ' + route.name)
    }


    // accessing app.context.req.path seems to lead to loop
    // app.context.req.path is not defined in some circumstances
    // this leads to an error which tries to redirect to the error page
    // which leads to a loop
    /*try {
        console.log('req.path: ' + app.context.req.path)
    } catch (error) {
        console.log(error)
    }*/
    

}