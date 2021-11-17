const express = require('express');
const router = express.Router();
const adminRoutes = require('./adminRoutes')
const dataItemsRoutes = require('./dataItemsRoutes')


router.use('/data-item', dataItemsRoutes)
router.use('/admin', adminRoutes)


module.exports = router;
