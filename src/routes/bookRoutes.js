const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { getBooks, getBook, addBook, editBook, removeBook, searchBooksHandler } = require('../controllers/bookController');
const { borrowBook, returnBook } = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { validate } = require('../middleware/validator');

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, borrowed]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', getBooks);

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search books by title or author
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of matched books
 *       400:
 *         description: Missing query parameter
 */
router.get('/search', searchBooksHandler);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get single book details
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get('/:id', getBook);

// Librarian only routes below

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add new book (Librarian only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - isbn
 *               - category
 *               - quantity
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book added
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', verifyToken, requireRole('librarian'), validate([
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').notEmpty().withMessage('ISBN is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
]), addBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book (Librarian only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               quantity:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [available, borrowed]
 *     responses:
 *       200:
 *         description: Book updated
 */
router.put('/:id', verifyToken, requireRole('librarian'), validate([
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be positive'),
  body('status').optional().isIn(['available', 'borrowed']).withMessage('Invalid status')
]), editBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete book (Librarian only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.delete('/:id', verifyToken, requireRole('librarian'), removeBook);

/**
 * @swagger
 * /api/books/{id}/borrow:
 *   post:
 *     summary: Borrow a book (Student only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 */
router.post('/:id/borrow', verifyToken, requireRole('student'), borrowBook);

/**
 * @swagger
 * /api/books/{id}/return:
 *   post:
 *     summary: Return a book (Student only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 */
router.post('/:id/return', verifyToken, requireRole('student'), returnBook);

module.exports = router;
