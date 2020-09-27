export default async function ({app, env, store, query, redirect, isDev}) {
    // https://stackoverflow.com/questions/56629722/redirect-all-routes-to-https-in-nuxt-project-hosted-in-heroku
    console.log('This is where we would redirect to HTTPS')
    console.log(app.context.req.header("x-forwarded-proto"))
    /*if (process.env.NODE_ENV === "production") {
        if (app.context.req.header("x-forwarded-proto") !== "https") {
            let redir = `https://${app.context.req.header("host")}${app.context.req.url}`
            console.log('HTTPS Required. Redirecting to: ' + redir)
            redirect(redir)
        }
    } else {
        console.log('HTTPS redirect bypassed in DEV')
    }*/
}