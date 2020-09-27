export default function ({app, route, query, redirect, isDev}) {

    const pages = ['index', 'error', 'coming-soon' ]

    if (process.env.NODE_ENV === "production" &&  !pages.includes(route.name)) 
    {
        console.log('const_redir.js Force Redirect')
        redirect('/coming-soon')
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