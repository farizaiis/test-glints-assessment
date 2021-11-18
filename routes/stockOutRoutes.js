const express = require('express');
const router = express.Router();
const stockOut = require('../controllers/stockOutController');
const { loginCheck } = require('../middlewares/authentication');

router.post('/', loginCheck, stockOut.createData);
router.put('/:id', loginCheck, stockOut.updateData);
router.delete('/:id', loginCheck, stockOut.deleteData);

module.exports = router;
