const { db } = require('../config/firebase');

const booksCollection = db.collection('Books');

const createBook = async (bookData) => {
  const docRef = booksCollection.doc();
  const newBook = {
    bookId: docRef.id,
    ...bookData,
    status: 'available',
    createdAt: new Date().toISOString()
  };
  await docRef.set(newBook);
  return newBook;
};

const getBookById = async (bookId) => {
  const doc = await booksCollection.doc(bookId).get();
  if (!doc.exists) return null;
  return doc.data();
};

const updateBook = async (bookId, updateData) => {
  await booksCollection.doc(bookId).update(updateData);
  return await getBookById(bookId);
};

const deleteBook = async (bookId) => {
  await booksCollection.doc(bookId).delete();
};

const getAllBooks = async (filters = {}) => {
  let query = booksCollection;
  
  if (filters.category) {
    query = query.where('category', '==', filters.category);
  }
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => doc.data());
};

const searchBooks = async (searchTerm) => {
  // Firestore doesn't support full-text search natively well without external extensions.
  // We'll do a simple fetch all and filter in memory for this assignment, 
  // or use range queries if it was just prefix search.
  const snapshot = await booksCollection.get();
  const books = snapshot.docs.map(doc => doc.data());
  
  const lowerSearch = searchTerm.toLowerCase();
  return books.filter(b => 
    b.title.toLowerCase().includes(lowerSearch) || 
    b.author.toLowerCase().includes(lowerSearch)
  );
};

module.exports = {
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  getAllBooks,
  searchBooks
};
