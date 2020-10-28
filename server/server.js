const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'

if (process.env.NODE_ENV === 'production') {
	console.log('Initializing server - Production')
}
else {
	console.log('Initializing server - Development')
}

process.env.DEBUG = 'nuxt:*'

const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')


const fs = require('fs')

const app = express()
const api = require('./api')


// This should now work with the top level varible
const config = require('../nuxt.config.js')
const nuxt = new Nuxt(config)

app.use(bodyParser.json())

const sixtyDaysInSeconds = 5184000
app.use(helmet.hsts({
	maxAge: sixtyDaysInSeconds
 }))

// Tell express to use the API routes in the API folder
// instead of specifying them manually
app.use('/api', api)

app.get('/_ah/health', (req, res) => {
	res.status(200)
	res.send()
})

if (config.dev) {
	const builder = new Builder(nuxt)
	builder.build().catch((error) => {
		console.error('Error detected in dev config')
		console.error(error)
		process.exit(1)
	})
}

app.use(nuxt.render)
app.listen(port, host)

if (process.env.LB_TLS === 'TRUE')
{
	//https server
	const https = require('https')
	https.createServer(nuxt.options.server.https, app).listen('8080', host)
}

console.log(`Setting server listening port to: ${port}`)