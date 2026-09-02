const { createTransaction, getTransactionById, updateTransaction, getUserTransactions, getAllTransactions, getActiveBorrowTransaction } = require('../models/transactionModel');
const { getBookById, updateBook } = require('../models/bookModel');

const borrowBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;

    const book = await getBookById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.status !== 'available' || book.quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Book is not currently available for borrowing' });
    }

    // Check if user already borrowed this book
    const existingBorrow = await getActiveBorrowTransaction(bookId, userId);
    if (existingBorrow) {
      return res.status(400).json({ success: false, message: 'You have already borrowed this book and not returned it yet' });
    }

    // Create transaction
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days borrow period

    const transaction = await createTransaction({
      userId,
      bookId,
      type: 'borrow',
      borrowDate: new Date().toISOString(),
      returnDate: null,
      dueDate: dueDate.toISOString(),
      status: 'active'
    });

    // Update book status/quantity
    await updateBook(bookId, { 
      quantity: book.quantity - 1,
      status: book.quantity - 1 === 0 ? 'borrowed' : 'available' 
    });

    res.status(201).json({ success: true, message: 'Book borrowed successfully', data: transaction });
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;

    const book = await getBookById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const transaction = await getActiveBorrowTransaction(bookId, userId);
    if (!transaction) {
      return res.status(400).json({ success: false, message: 'No active borrow transaction found for this book and user' });
    }

    const isOverdue = new Date() > new Date(transaction.dueDate);

    // Update transaction
    const updatedTransaction = await updateTransaction(transaction.transactionId, {
      returnDate: new Date().toISOString(),
      status: isOverdue ? 'overdue' : 'returned'
    });

    // Update book status/quantity
    await updateBook(bookId, { 
      quantity: book.quantity + 1,
      status: 'available' 
    });

    res.json({ 
      success: true, 
      message: 'Book returned successfully', 
      isOverdue,
      data: updatedTransaction 
    });
  } catch (error) {
    next(error);
  }
};

const getAllTrans = async (req, res, next) => {
  try {
    const transactions = await getAllTransactions();
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    next(error);
  }
};

const getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await getUserTransactions(req.user.userId);
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getAllTrans,
  getMyTransactions
};
