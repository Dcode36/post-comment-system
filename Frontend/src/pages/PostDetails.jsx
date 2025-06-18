import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Stack,
  CircularProgress,
  Avatar,
  Chip,
  Card,
  CardContent,
  IconButton,
  Collapse,
  Badge,
} from '@mui/material';
import {
  Reply as ReplyIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background',
    'link', 'blockquote', 'code-block'
  ];

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/posts/${id}`);
      setPost(res.data);
      if (res.data?.createdBy._id === user._id) setIsAuthor(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(
        `http://localhost:9000/api/comments`,
        { postId: id, text: comment },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setComment('');
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    try {
      await axios.post(
        `http://localhost:9000/api/comments/${commentId}/reply`,
        { text: replyText },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setReply((prev) => ({ ...prev, [commentId]: '' }));
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" sx={{ gap: 2 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">Loading post...</Typography>
      </Box>
    );
  }

  const groupedComments = post.comments.reduce((acc, comment) => {
    if (!comment.isReply) {
      acc[comment._id] = { ...comment, replies: [] };
    } else {
      if (acc[comment.replyTo]) {
        acc[comment.replyTo].replies.push(comment);
      } else {
        acc[comment.replyTo] = { replies: [comment] };
      }
    }
    return acc;
  }, {});

  const mainComments = Object.values(groupedComments).filter(c => !c.isReply);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box
        component="nav"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Button variant="text" onClick={() => window.history.back()} sx={{ textTransform: 'none' }}>
          ← Back
        </Button>
        <Button variant="contained" color="primary" href="/" sx={{ borderRadius: 2 }}>
          Home
        </Button>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
        {/* Left: Post */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', lineHeight: 1.2 }}>
                  {post.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {post.createdBy.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Author
                    </Typography>
                  </Box>
                  {isAuthor && (
                    <Chip label="Your Post" size="small" color="primary" variant="outlined" />
                  )}
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  '& p': { marginBottom: '1em' },
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  color: 'text.primary'
                }}
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Right: Comments */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <CommentIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Discussion
                </Typography>
                <Badge badgeContent={mainComments.length} color="primary" sx={{ ml: 1 }} />
              </Box>

              <Stack spacing={3} sx={{ mb: 4 }}>
                {mainComments.length === 0 ? (
                  <Box textAlign="center" py={6} color="text.secondary">
                    <CommentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" mb={1}>No comments yet</Typography>
                    <Typography variant="body2">Be the first to share your thoughts!</Typography>
                  </Box>
                ) : (
                  mainComments.map((c) => (
                    <Paper
                      key={c._id}
                      elevation={0}
                      sx={{
                        p: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'grey.50'
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                          {(user && c.userId === user._id ? 'You' : c.userId.name).charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            {user && c.userId === user._id ? 'You' : c.userId.name}
                          </Typography>
                          <Box
                            sx={{ '& p': { margin: 0 }, '& ul, & ol': { paddingLeft: 2 }, mb: 2 }}
                            dangerouslySetInnerHTML={{ __html: c.text }}
                          />

                          {c.replies?.length > 0 && (
                            <Button
                              startIcon={expandedReplies[c._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              onClick={() => toggleReplies(c._id)}
                              size="small"
                              sx={{ mb: 2 }}
                            >
                              {c.replies.length} {c.replies.length === 1 ? 'Reply' : 'Replies'}
                            </Button>
                          )}

                          <Collapse in={expandedReplies[c._id] || c.replies?.length <= 2}>
                            {c.replies?.length > 0 && (
                              <Box sx={{ pl: 3, borderLeft: '2px solid', borderColor: 'divider' }}>
                                {c.replies.map((r) => (
                                  <Box key={r._id} sx={{ mb: 2, display: 'flex', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                                      <ReplyIcon sx={{ fontSize: 16 }} />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="body2" fontWeight={600} mb={0.5}>
                                        {user && r.userId === user._id ? 'You' : r.userId.name}
                                      </Typography>
                                      <Box
                                        sx={{ '& p': { margin: 0, fontSize: '0.9rem' }, '& ul, & ol': { paddingLeft: 2 } }}
                                        dangerouslySetInnerHTML={{ __html: r.text }}
                                      />
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </Collapse>

                          {isAuthor && (
                            <>
                              <Button
                                variant="text"
                                size="small"
                                startIcon={<ReplyIcon />}
                                sx={{ mt: 1 }}
                                onClick={() => setActiveReplyCommentId(c._id)}
                              >
                                Reply
                              </Button>

                              {activeReplyCommentId === c._id && (
                                <Box mt={3} p={3} bgcolor="background.paper" borderRadius={2}>
                                  <Typography variant="subtitle2" mb={2} display="flex" alignItems="center" gap={1}>
                                    <ReplyIcon fontSize="small" />
                                    Reply as Author
                                  </Typography>
                                  <ReactQuill
                                    theme="snow"
                                    value={reply[c._id] || ''}
                                    onChange={(content) => setReply((prev) => ({ ...prev, [c._id]: content }))}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Write your reply..."
                                    style={{ marginBottom: '16px' }}
                                  />
                                  <Box display="flex" gap={2} justifyContent="flex-end">
                                    <Button
                                      variant="outlined"
                                      onClick={() => {
                                        setReply((prev) => ({ ...prev, [c._id]: '' }));
                                        setActiveReplyCommentId(null);
                                      }}
                                      sx={{ borderRadius: 2 }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="contained"
                                      startIcon={<ReplyIcon />}
                                      onClick={() => {
                                        handleReply(c._id, reply[c._id]);
                                        setActiveReplyCommentId(null);
                                      }}
                                      disabled={!reply[c._id]?.trim()}
                                      sx={{ borderRadius: 2 }}
                                    >
                                      Post Reply
                                    </Button>
                                  </Box>
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))
                )}
              </Stack>

              <Divider sx={{ my: 4 }} />

              {/* Add Comment */}
              <Box>
                <Typography variant="h6" mb={3} display="flex" alignItems="center" gap={1} fontWeight={600}>
                  <CommentIcon />
                  Add Your Comment
                </Typography>
                <form onSubmit={handleComment}>
                  <Paper elevation={0} sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:focus-within': {
                      borderColor: 'primary.main'
                    }
                  }}>
                    <ReactQuill
                      theme="snow"
                      value={comment}
                      onChange={setComment}
                      modules={modules}
                      formats={formats}
                      placeholder="Share your thoughts on this post..."
                      style={{ marginBottom: '16px' }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                      <Button variant="outlined" onClick={() => setComment('')} disabled={!comment.trim()} sx={{ borderRadius: 2 }}>
                        Clear
                      </Button>
                      <Button type="submit" variant="contained" disabled={!comment.trim()} sx={{ borderRadius: 2, px: 4 }}>
                        Post Comment
                      </Button>
                    </Box>
                  </Paper>
                </form>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Container>
  );
};

export default PostDetails;
