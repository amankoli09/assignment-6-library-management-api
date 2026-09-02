const { db } = require('../config/firebase');

const transactionsCollection = db.collection('Transactions');

const createTransaction = async (transactionData) => {
  const docRef = transactionsCollection.doc();
  const newTransaction = {
    transactionId: docRef.id,
    ...transactionData,
  };
  await docRef.set(newTransaction);
  return newTransaction;
};

const getTransactionById = async (transactionId) => {
  const doc = await transactionsCollection.doc(transactionId).get();
  if (!doc.exists) return null;
  return doc.data();
};

const updateTransaction = async (transactionId, updateData) => {
  await transactionsCollection.doc(transactionId).update(updateData);
  return await getTransactionById(transactionId);
};

const getUserTransactions = async (userId) => {
  const snapshot = await transactionsCollection.where('userId', '==', userId).get();
  return snapshot.docs.map(doc => doc.data());
};

const getAllTransactions = async () => {
  const snapshot = await transactionsCollection.get();
  return snapshot.docs.map(doc => doc.data());
};

const getActiveBorrowTransaction = async (bookId, userId) => {
  const snapshot = await transactionsCollection
    .where('bookId', '==', bookId)
    .where('userId', '==', userId)
    .where('status', 'in', ['active', 'overdue'])
    .where('type', '==', 'borrow')
    .limit(1)
    .get();
    
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
};

module.exports = {
  createTransaction,
  getTransactionById,
  updateTransaction,
  getUserTransactions,
  getAllTransactions,
  getActiveBorrowTransaction
};
