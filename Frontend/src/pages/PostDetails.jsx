import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
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
  ArrowBack as ArrowBackIcon,
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
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}`);
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
        `${import.meta.env.VITE_BACKEND_URL}/api/comments`,
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
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}/reply`,
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
      <Box 
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={4} 
          sx={{ color: '#1e293b' }}
        />
        <Typography variant="h6" sx={{ color: '#64748b' }}>
          Loading post...
        </Typography>
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Navigation */}
      <Box
        component="nav"
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 2,
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Button 
          variant="text" 
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            textTransform: 'none',
            color: '#64748b',
            '&:hover': {
              backgroundColor: '#f1f5f9',
              color: '#1e293b'
            }
          }}
        >
          Back
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
          {/* Left: Post */}
          <Box sx={{ flex: 1 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                backgroundColor: 'white',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 3,
                      color: '#1e293b',
                      lineHeight: 1.2
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#1e293b',
                        width: 40,
                        height: 40
                      }}
                    >
                      {post.createdBy.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1e293b'
                        }}
                      >
                        {post.createdBy.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ color: '#64748b' }}
                      >
                        Author
                      </Typography>
                    </Box>
                    {isAuthor && (
                      <Chip 
                        label="Your Post" 
                        size="small" 
                        sx={{
                          backgroundColor: '#f1f5f9',
                          color: '#1e293b',
                          border: '1px solid #e2e8f0',
                          fontWeight: 500
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Divider sx={{ mb: 4, borderColor: '#e2e8f0' }} />

                <Box
                  sx={{
                    '& p': { marginBottom: '1em' },
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    color: '#1e293b'
                  }}
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              </CardContent>
            </Paper>
          </Box>

          {/* Right: Comments */}
          <Box sx={{ flex: 1 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                backgroundColor: 'white'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <CommentIcon sx={{ color: '#1e293b' }} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#1e293b'
                    }}
                  >
                    Discussion
                  </Typography>
                  <Badge 
                    badgeContent={mainComments.length} 
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#1e293b',
                        color: 'white'
                      }
                    }}
                  />
                </Box>

                <Stack spacing={3} sx={{ mb: 4 }}>
                  {mainComments.length === 0 ? (
                    <Box 
                      sx={{
                        textAlign: 'center',
                        py: 6,
                        color: '#64748b'
                      }}
                    >
                      <CommentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" sx={{ mb: 1, color: '#1e293b' }}>
                        No comments yet
                      </Typography>
                      <Typography variant="body2">
                        Be the first to share your thoughts!
                      </Typography>
                    </Box>
                  ) : (
                    mainComments.map((c) => (
                      <Paper
                        key={c._id}
                        elevation={0}
                        sx={{
                          p: 3,
                          border: '1px solid #e2e8f0',
                          borderRadius: 2,
                          backgroundColor: '#fafafa'
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: '#64748b',
                              width: 40,
                              height: 40,
                              fontSize: '0.9rem'
                            }}
                          >
                            {(user && c.userId === user._id ? 'You' : c.userId.name).charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                mb: 1,
                                color: '#1e293b'
                              }}
                            >
                              {user && c.userId === user._id ? 'You' : c.userId.name}
                            </Typography>
                            <Box
                              sx={{ 
                                '& p': { margin: 0, color: '#1e293b' },
                                '& ul, & ol': { paddingLeft: 2 },
                                mb: 2
                              }}
                              dangerouslySetInnerHTML={{ __html: c.text }}
                            />

                            {c.replies?.length > 0 && (
                              <Button
                                startIcon={expandedReplies[c._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                onClick={() => toggleReplies(c._id)}
                                size="small"
                                sx={{ 
                                  mb: 2,
                                  color: '#64748b',
                                  textTransform: 'none',
                                  '&:hover': {
                                    backgroundColor: '#f1f5f9',
                                    color: '#1e293b'
                                  }
                                }}
                              >
                                {c.replies.length} {c.replies.length === 1 ? 'Reply' : 'Replies'}
                              </Button>
                            )}

                            <Collapse in={expandedReplies[c._id] || c.replies?.length <= 2}>
                              {c.replies?.length > 0 && (
                                <Box sx={{ pl: 3, borderLeft: '2px solid #e2e8f0' }}>
                                  {c.replies.map((r) => (
                                    <Box key={r._id} sx={{ mb: 2, display: 'flex', gap: 2 }}>
                                      <Avatar 
                                        sx={{ 
                                          bgcolor: '#94a3b8',
                                          width: 32,
                                          height: 32
                                        }}
                                      >
                                        <ReplyIcon sx={{ fontSize: 16 }} />
                                      </Avatar>
                                      <Box sx={{ flex: 1 }}>
                                        <Typography 
                                          variant="body2" 
                                          sx={{ 
                                            fontWeight: 600,
                                            mb: 0.5,
                                            color: '#1e293b'
                                          }}
                                        >
                                          {user && r.userId === user._id ? 'You' : r.userId.name}
                                        </Typography>
                                        <Box
                                          sx={{ 
                                            '& p': { margin: 0, fontSize: '0.9rem', color: '#1e293b' },
                                            '& ul, & ol': { paddingLeft: 2 }
                                          }}
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
                                  sx={{ 
                                    mt: 1,
                                    color: '#64748b',
                                    textTransform: 'none',
                                    '&:hover': {
                                      backgroundColor: '#f1f5f9',
                                      color: '#1e293b'
                                    }
                                  }}
                                  onClick={() => setActiveReplyCommentId(c._id)}
                                >
                                  Reply
                                </Button>

                                {activeReplyCommentId === c._id && (
                                  <Box 
                                    sx={{
                                      mt: 3,
                                      p: 3,
                                      backgroundColor: 'white',
                                      borderRadius: 2,
                                      border: '1px solid #e2e8f0'
                                    }}
                                  >
                                    <Typography 
                                      variant="subtitle2" 
                                      sx={{
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#1e293b',
                                        fontWeight: 600
                                      }}
                                    >
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
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                      <Button
                                        variant="outlined"
                                        onClick={() => {
                                          setReply((prev) => ({ ...prev, [c._id]: '' }));
                                          setActiveReplyCommentId(null);
                                        }}
                                        sx={{ 
                                          borderRadius: 1,
                                          textTransform: 'none',
                                          borderColor: '#e2e8f0',
                                          color: '#64748b',
                                          '&:hover': {
                                            borderColor: '#1e293b',
                                            color: '#1e293b'
                                          }
                                        }}
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
                                        sx={{ 
                                          borderRadius: 1,
                                          backgroundColor: '#1e293b',
                                          textTransform: 'none',
                                          '&:hover': {
                                            backgroundColor: '#334155'
                                          }
                                        }}
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

                <Divider sx={{ my: 4, borderColor: '#e2e8f0' }} />

                {/* Add Comment */}
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontWeight: 600,
                      color: '#1e293b'
                    }}
                  >
                    <CommentIcon />
                    Add Your Comment
                  </Typography>
                  <form onSubmit={handleComment}>
                    <Paper 
                      elevation={0} 
                      sx={{
                        p: 3,
                        border: '2px solid #e2e8f0',
                        borderRadius: 2,
                        backgroundColor: '#fafafa',
                        '&:focus-within': {
                          borderColor: '#1e293b',
                          backgroundColor: 'white'
                        }
                      }}
                    >
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
                        <Button 
                          variant="outlined" 
                          onClick={() => setComment('')} 
                          disabled={!comment.trim()}
                          sx={{ 
                            borderRadius: 1,
                            textTransform: 'none',
                            borderColor: '#e2e8f0',
                            color: '#64748b',
                            '&:hover': {
                              borderColor: '#1e293b',
                              color: '#1e293b'
                            }
                          }}
                        >
                          Clear
                        </Button>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          disabled={!comment.trim()}
                          sx={{ 
                            borderRadius: 1,
                            px: 4,
                            backgroundColor: '#1e293b',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#334155'
                            }
                          }}
                        >
                          Post Comment
                        </Button>
                      </Box>
                    </Paper>
                  </form>
                </Box>
              </CardContent>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default PostDetails;