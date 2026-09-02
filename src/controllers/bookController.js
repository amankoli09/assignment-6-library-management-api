const { createBook, getBookById, updateBook, deleteBook, getAllBooks, searchBooks } = require('../models/bookModel');

const getBooks = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.status) filters.status = req.query.status;

    const books = await getAllBooks(filters);
    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const addBook = async (req, res, next) => {
  try {
    const newBook = await createBook(req.body);
    res.status(201).json({ success: true, message: 'Book created successfully', data: newBook });
  } catch (error) {
    next(error);
  }
};

const editBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const existingBook = await getBookById(bookId);
    
    if (!existingBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const updatedBook = await updateBook(bookId, req.body);
    res.json({ success: true, message: 'Book updated successfully', data: updatedBook });
  } catch (error) {
    next(error);
  }
};

const removeBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const existingBook = await getBookById(bookId);
    
    if (!existingBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    await deleteBook(bookId);
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const searchBooksHandler = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
    }

    const books = await searchBooks(q);
    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBook,
  addBook,
  editBook,
  removeBook,
  searchBooksHandler
};
