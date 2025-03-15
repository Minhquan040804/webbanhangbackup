const express = require('express');
const router = express.Router();
const userAccountController = require('../controllers/userAccountController');

// Lấy danh sách tài khoản
router.get('/', userAccountController.getAllAccounts);

// Tạo tài khoản mới
router.post('/', userAccountController.createAccount);

// Lấy thông tin người dùng theo account_id
router.get('/:account_id/user', userAccountController.getUserByAccountId);

// Cập nhật thông tin người dùng
router.put('/:account_id/user', userAccountController.updateUser);

// Xóa user (không ảnh hưởng đến account)
router.delete('/:account_id/user', userAccountController.deleteUser);

// Xóa account (xóa luôn user liên quan)
router.delete('/:account_id', userAccountController.deleteAccount);

module.exports = router;
