const express = require('express')
const router = express.Router()
const { indexAPI, successAPI, failedAPI } = require('../controller/result')

router.get('', indexAPI)
router.get('/success', successAPI)
router.get('/failed', failedAPI)

module.exports = router