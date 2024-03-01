const express = require('express');
const requireJwtAuth = require('../middleware/requireJwtAuth');
const { getUserController, updateUserPluginsController, getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/UserController');

const router = express.Router();

router.get('/', requireJwtAuth, getUserController);
router.post('/plugins', requireJwtAuth, updateUserPluginsController);

router.get('/get_all_users', requireJwtAuth, getAllUsers);
router.get('/:id', requireJwtAuth, getUser);
router.post('/', requireJwtAuth, createUser);
router.put('/:id', requireJwtAuth, updateUser);
router.delete('/:id', requireJwtAuth, deleteUser);

module.exports = router;