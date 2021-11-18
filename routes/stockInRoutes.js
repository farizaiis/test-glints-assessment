const express = require('express');
const router = express.Router();
const stockIn = require('../controllers/stockInController');
const { loginCheck } = require('../middlewares/authentication');

router.post('/', loginCheck, stockIn.createData);
router.put('/:id', loginCheck, stockIn.updateData);
router.delete('/:id', loginCheck, stockIn.deleteData);

module.exports = router;
