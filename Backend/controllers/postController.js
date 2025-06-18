// controllers/postController.js
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
  const { title, body } = req.body;
  try {
    const post = await Post.create({
      title,
      body,
      createdBy: req.user._id
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comments = await Comment.find({ postId: post._id })
      .populate('userId', 'name email'); // 👈 Adds name and email to each comment's user

    res.json({ ...post.toObject(), comments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
};



// Toggle like/unlike a post
exports.toggleLike = async (req, res) => {
    const postId = req.params.id;
    const userId = '6852988c5cb5a989743aac49';
  
    try {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      const alreadyLiked = post.likes.includes(userId);
  
      if (alreadyLiked) {
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        await post.save();
        return res.json({ message: 'Post unliked', status:false });
      } else {
        post.likes.push(userId);
        await post.save();
        return res.json({ message: 'Post liked', status:true });
      }
    } catch (err) {
      res.status(500).json({ message: 'Like/unlike failed', error: err.message });
    }
  };
  