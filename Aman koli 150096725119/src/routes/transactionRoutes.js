const express = require('express');
const router = express.Router();

const { borrowBook, returnBook, getAllTrans, getMyTransactions } = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions (Librarian only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 */
router.get('/', verifyToken, requireRole('librarian'), getAllTrans);

/**
 * @swagger
 * /api/transactions/my:
 *   get:
 *     summary: Get user's transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's transactions
 */
router.get('/my', verifyToken, getMyTransactions);

// These routes are mounted differently in the PDF: POST /api/books/:id/borrow and POST /api/books/:id/return
// Since we have a /api/transactions endpoint, I will mount them on the book router.
// But to keep logic separated, we can export them from transactionController and use them in bookRoutes.
// Wait, looking at the PDF, the routes are:
// POST /api/books/:id/borrow
// POST /api/books/:id/return
// I will just add them to bookRoutes.js instead.
// I will rewrite this file to just have the GET endpoints for transactions.

module.exports = router;
