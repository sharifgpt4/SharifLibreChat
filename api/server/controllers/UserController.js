const { updateUserPluginsService } = require('~/server/services/UserService');
const { registerUser } = require('~/server/services/AuthService');
const { updateUserPluginAuth, deleteUserPluginAuth } = require('~/server/services/PluginService');
const { logger } = require('~/config');
const User = require('~/models/User'); // Adjust the path to where your User model is located

const getUserController = async (req, res) => {
  res.status(200).send(req.user);
};

const updateUserPluginsController = async (req, res) => {
  const { user } = req;
  const { pluginKey, action, auth, isAssistantTool } = req.body;
  let authService;
  try {
    if (!isAssistantTool) {
      const userPluginsService = await updateUserPluginsService(user, pluginKey, action);

      if (userPluginsService instanceof Error) {
        logger.error('[userPluginsService]', userPluginsService);
        const { status, message } = userPluginsService;
        res.status(status).send({ message });
      }
    }

    if (auth) {
      const keys = Object.keys(auth);
      const values = Object.values(auth);
      if (action === 'install' && keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          authService = await updateUserPluginAuth(user.id, keys[i], pluginKey, values[i]);
          if (authService instanceof Error) {
            logger.error('[authService]', authService);
            const { status, message } = authService;
            res.status(status).send({ message });
          }
        }
      }
      if (action === 'uninstall' && keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          authService = await deleteUserPluginAuth(user.id, keys[i]);
          if (authService instanceof Error) {
            logger.error('[authService]', authService);
            const { status, message } = authService;
            res.status(status).send({ message });
          }
        }
      }
    }

    res.status(200).send();
  } catch (err) {
    logger.error('[updateUserPluginsController]', err);
    res.status(500).json({ message: err.message });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const { query } = req;
    const page = parseInt(query._page) || 1;
    const perPage = parseInt(query._perPage) || 10;
    const sortField = query._sortField || 'createdAt';
    const sortOrder = query._sortOrder === 'ASC' ? 1 : -1;
    const filter = query._filter ? JSON.parse(query._filter) : {};

    // Building the sort object based on React Admin's request
    const sort = {};
    sort[sortField] = sortOrder;

    // Implementing basic filtering - adjust based on your needs
    const filterQuery = {};
    Object.keys(filter).forEach((key) => {
      filterQuery[key] = { $regex: filter[key], $options: 'i' };
    });

    const users = await User.find(filterQuery)
      .sort(sort)
      .skip((page - 1) * perPage)
      .limit(perPage);

    // You also need to send back the total count of records for pagination
    const total = await User.countDocuments(filterQuery);

    res.header('X-Total-Count', total);
    res.status(200).json(users);
  } catch (err) {
    logger.error('[getAllUsersController]', err);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from result
    res.json(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const response = await registerUser(req.body, true); // Pass true to indicate admin action
    if (response.status === 200) {
      // Optionally, handle token generation and response
      res.status(201).json({ user: response.user });
    } else {
      res.status(response.status).json({ message: response.message });
    }
  } catch (err) {
    logger.error('[createUser]', err);
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, username, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, username, email, role },
      { new: true },
    );
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', id: user._id });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getUserController,
  updateUserPluginsController,
  getAllUsersController,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
