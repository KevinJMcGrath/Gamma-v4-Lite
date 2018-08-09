// NOTE: index.js is imported first when import/require is used on a path. 
// This is a Node convention (also used by the packager modules).
const { Router } = require('express')
const sfdc = require('./sfdc.js')

const router = Router()

router.use(sfdc)

module.exports = router