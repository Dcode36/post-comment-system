// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const {
  addComment,
  replyToComment,
  getCommentsForPost
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addComment); // POST comment
router.post('/:commentId/reply', authMiddleware, replyToComment); // POST reply
router.get('/post/:postId', getCommentsForPost); // GET all comments + replies

module.exports = router;
