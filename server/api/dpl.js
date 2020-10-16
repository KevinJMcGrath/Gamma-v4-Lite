const { Router } = require('express')
const axios = require('axios')

const router = Router()

function axios_error(error)
{
	let err_obj = {}

	if (error.response)
	{
		err_obj.status = error.status
		err_obj.message = error.response.statusText
		err_obj.data = error.response.data
	}
	else if (error.request)
	{
		// Request was made but no response was received
		console.error('Request was sent but received no response')
		console.error(error.request)

		err_obj.status = 500
		err_obj.message = 'Server Error'		
	}
	else
	{
		console.error('Unknown Error: ' + error.message)

		err_obj.status = 500
		err_obj.message = 'Unkown error'
		err_obj.data = ''
	}

	return err_obj
}

router.post('/dpl_check', function(req, res, next) {
	const config = {
		baseURL: "https://api.trade.gov",
		headers: {
			'Authorization': 'Bearer ' + process.env.DPL_KEY
        },
        params: {
            q: req.body.qp
        }        
	}
    
	axios.get('/gateway/v1/consolidated_screening_list/search', config)
	.then((response) => {
        if (response.data.total === 0)
        {
            res.json({ 
                success: true
            })
        } else {
            res.json({success: false})
        }		
	})
	.catch((error) => {
		let err_obj = axios_error(error)
		let err_code = -99

		if (error.response && error.response.code) {
			err_code = error.response.code
		}

		res.status(500).json({ success: false, message: err_obj.message, code: err_code})
	})
})

module.exports = router