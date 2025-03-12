const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productCategoryController');

router.get('/', productCategoryController.getAllCategories);
router.get('/:id', productCategoryController.getCategoryById);
router.post('/', productCategoryController.createCategory);
router.put('/:id', productCategoryController.updateCategory);
router.delete('/:id', productCategoryController.deleteCategory);

module.exports = router;
