const express = require('express');
const router = express.Router();
const adminRoutes = require('./adminRoutes')
const dataItemsRoutes = require('./dataItemsRoutes')
const stockInRoutes = require('./stockInRoutes')
const stockOutRoutes = require('./stockOutRoutes')


router.use('/data-item', dataItemsRoutes)
router.use('/admin', adminRoutes)
router.use('/stock-in', stockInRoutes)
router.use('/stock-out', stockOutRoutes)


module.exports = router;
