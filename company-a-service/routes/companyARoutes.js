const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { loginValidation } = require('../middleware/validateForm');

router.get('/employees', authMiddleware, userController.getAllUsers);
router.post('/employees',authMiddleware, userController.createUser);
router.post('/login-karyawan', loginValidation, userController.login);
router.post('/login-admin', loginValidation, userController.loginAdmin);
router.put('/edit/:nip', authMiddleware, userController.editUser);
router.delete('/delete/:nip', authMiddleware, userController.deleteUser);

module.exports = router;
