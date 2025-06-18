// controllers/commentController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add a comment to a post
exports.addComment = async (req, res) => {
  const { postId, text } = req.body;
  try {
    const comment = await Comment.create({
      postId,
      userId: req.user._id,
      text,
      isReply: false
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

// Reply to a comment (only by post creator)
exports.replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const parentComment = await Comment.findById(commentId).populate('postId');
    if (!parentComment) return res.status(404).json({ message: 'Comment not found' });

    const post = parentComment.postId;
    if (String(post.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only post creator can reply to comments' });
    }

    const reply = await Comment.create({
      postId: post._id,
      userId: req.user._id,
      text,
      isReply: true,
      replyTo: commentId
    });

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: 'Reply failed', error: err.message });
  }
};

// Get all comments for a post (with replies)
exports.getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });

    const structured = comments.filter(c => !c.isReply).map(c => ({
      ...c.toObject(),
      replies: comments.filter(r => r.isReply && String(r.replyTo) === String(c._id))
    }));

    res.json(structured);
  } catch (err) {
    res.status(500).json({ message: 'Could not get comments', error: err.message });
  }
};
