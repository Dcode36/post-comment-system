// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getSinglePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const { toggleLike } = require('../controllers/postController');

router.get('/', getAllPosts);
router.get('/:id', getSinglePost);
router.post('/', authMiddleware, createPost);
router.post('/:id/like',authMiddleware, toggleLike);

module.exports = router;
