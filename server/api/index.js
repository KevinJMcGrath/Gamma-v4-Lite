// NOTE: index.js is imported first when import/require is used on a path. 
// This is a Node convention (also used by the packager modules).
const { Router } = require('express')
const sfdc = require('./sfdc.js')

const router = Router()

router.use(sfdc)

router.post('/test-code', function(req, res, next) {

    let inbound_code = req.body.test_code
    if (inbound_code === 'abaf968-16a3-c59-9d70-729f97fba2') {
        res.json({ "valid": true })
    }

    res.status(403).json({ "valid": false, "message": "Invalid test code received." })
})

module.exports = router