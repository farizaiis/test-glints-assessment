const express = require('express');
const router = express.Router();
const dataItems = require('../controllers/dataItemsController');
const { loginCheck } = require('../middlewares/authentication')

router.post('/', loginCheck, dataItems.createDataItem);
router.put('/:id', loginCheck, dataItems.updateDataItemById);
router.delete('/:id', loginCheck, dataItems.deleteDataItemsById);
router.get('/:id', loginCheck, dataItems.getDataById);
router.get('/', loginCheck, dataItems.getAllData)

module.exports = router;