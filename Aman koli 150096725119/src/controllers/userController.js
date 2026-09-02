const { getAllUsers, getUserById, updateUser, deleteUser } = require('../models/userModel');

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    // Remove passwords from response
    const sanitizedUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    res.json({ success: true, count: sanitizedUsers.length, data: sanitizedUsers });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    if (!['student', 'librarian'].includes(role)) {
       return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updatedUser = await updateUser(userId, { role });
    const { password, ...safeUser } = updatedUser;
    
    res.json({ success: true, message: 'User role updated', data: safeUser });
  } catch (error) {
    next(error);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await deleteUser(userId);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUserRole,
  removeUser
};
