const express = require('express');
const { requireJwtAuth, canDeleteAccount, verifyEmailLimiter } = require('~/server/middleware');
const {
  getUserController,
  deleteUserController,
  verifyEmailController,
  updateUserPluginsController,
  resendVerificationController,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('~/server/controllers/UserController');

const router = express.Router();

router.get('/', requireJwtAuth, getUserController);
router.post('/plugins', requireJwtAuth, updateUserPluginsController);
router.delete('/delete', requireJwtAuth, canDeleteAccount, deleteUserController);
router.post('/verify', verifyEmailController);
router.post('/verify/resend', verifyEmailLimiter, resendVerificationController);

router.get('/get_all_user', requireJwtAuth, getAllUsers);
router.get('/:id', requireJwtAuth, getUser);
router.post('/', requireJwtAuth, createUser);
router.put('/:id', requireJwtAuth, updateUser);
router.delete('/:id', requireJwtAuth, deleteUser);

module.exports = router;
