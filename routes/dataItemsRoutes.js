const express = require('express');
const router = express.Router();
const dataItems = require('../controllers/dataItemsController');
const { loginCheck } = require('../middlewares/authentication')

router.post('/', dataItems.createDataItem);
router.put('/:id', dataItems.updateDataItemById);
router.delete('/:id', dataItems.deleteDataItemsById);
router.get('/:id', dataItems.getDataById);
router.get('/', dataItems.getAllData)

module.exports = router;