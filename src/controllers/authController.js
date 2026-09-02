const bcrypt = require('bcrypt');
const { createUser, getUserByEmail, getUserById, updateUser } = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newUser = await createUser(userId, {
      name,
      email,
      password: hashedPassword,
      role: role || 'student' // default to student if not provided
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { userId: newUser.userId, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.userId, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: { userId: user.userId, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: { userId: user.userId, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    // We only allow updating name for simplicity in this profile route
    const updatedUser = await updateUser(req.user.userId, { name });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { userId: updatedUser.userId, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
