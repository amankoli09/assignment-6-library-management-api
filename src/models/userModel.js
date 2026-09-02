const { db } = require('../config/firebase');

const usersCollection = db.collection('Users');

const createUser = async (userId, userData) => {
  await usersCollection.doc(userId).set({
    userId,
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { userId, ...userData };
};

const getUserByEmail = async (email) => {
  const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
};

const getUserById = async (userId) => {
  const doc = await usersCollection.doc(userId).get();
  if (!doc.exists) return null;
  return doc.data();
};

const updateUser = async (userId, updateData) => {
  await usersCollection.doc(userId).update({
    ...updateData,
    updatedAt: new Date().toISOString()
  });
  return await getUserById(userId);
};

const deleteUser = async (userId) => {
  await usersCollection.doc(userId).delete();
};

const getAllUsers = async () => {
  const snapshot = await usersCollection.get();
  return snapshot.docs.map(doc => doc.data());
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers
};
