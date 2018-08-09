// Adding automatic tracing through the TraceAgent
if (process.env.NODE_ENV === 'production') {
	require('@google-cloud/trace-agent').start()
	require('@google-cloud/debug-agent').start({ allowExpressions: true });
}

/*
else {
	require('@google-cloud/trace-agent').start({
		projectId: 'symphony-gamma-poc',
		keyFilename: './credentials/symphony-gamma-poc-493624b6cca1.json'
	})

	require('@google-cloud/debug-agent').start({
		allowExpressions: true,
  		projectId: 'symphony-gamma-poc',
  		keyFilename: './credentials/symphony-gamma-poc-493624b6cca1.json'
});
}*/

const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'

console.log(`Are the ENV Variables working?: ${process.env.SFDC_API_KEY}`)

let serverState = process.env.NODE_ENV || 'development'
console.log(`Server State detected as: ${serverState}`)

if (process.env.NODE_ENV === 'production') {
	console.log('Initializing server - Production')
}
else {
	console.log('Initializing server - Development')
}

const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const express = require('express')

const app = express()
const api = require('./api')

app.use(bodyParser.json())

// Tell express to use the API routes in the API folder
// instead of specifying them manually
app.use('/api', api)


app.get('/_ah/health', (req, res) => {
	res.status(200)
	res.send()
})


app.get('/bob', (req, res) => { 
	res.status(200).json({ message: "hello" })
})

/*app.get('*', (req, res) => {
	console.log('Came here before moving on')
})*/


const config = require('../nuxt.config.js')

const nuxt = new Nuxt(config)

if (config.dev) {
	const builder = new Builder(nuxt)
	builder.build().catch((error) => {
		console.error('Error detected in dev config section (line 72)')
		console.error(error)
		process.exit(1)
	})
}

// Winston should either go here

//app.use(nuxt.render)


/*app.use(nuxt.render(req,res).then((req, res) => {
	console.log(res)
}))*/


//Or here. nuxt.render is technically middleware, but it's not using the express server



//Production error handler
/*app.use((err, req, res) => {
	console.error('Error rendering route')
	console.error(err.message)
	console.error(err.statusCode)

	res.status(err.status || 500)
	res.render('error', {
		message: err.message,
		error: {}
	})
})*/


app.use(nuxt.render)
app.listen(port, host)

console.log(`Setting server listening port to: ${port}`)