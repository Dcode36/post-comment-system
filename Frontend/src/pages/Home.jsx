import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Divider,
  Avatar,
  Tooltip,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ForumIcon from '@mui/icons-material/Forum';
import Navbar from '../components/Navbar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/`);
      const postsWithLikeStatus = res.data.reverse().map(post => ({
        ...post,
        isLikedByUser: user ? post.likes.includes(user._id) : false,
      }));
      setPosts(postsWithLikeStatus);
    } catch (err) {
      console.error(err);
    } finally {
      // toast.success("Posts fetched successfully")
      setLoading(false);
    }
  };

  const toggleLike = async (id) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      fetchPosts();
      if(res.data.status){
        toast('Liked', {
          icon:'👍'
        })
      }else{
        toast('Disliked', {
          icon:'👎'
        })
      }
    
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      alert("Title and body cannot be empty.");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      setOpen(false);
      setNewPost({ title: '', body: '' });
      fetchPosts();
      toast.success("Post created successfully")
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Navbar />
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} mt={3}>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            📝 Recent Posts ({posts.length})
          </Typography>
          {user && (
            <Button
              variant="contained"
              sx={{ 
                borderRadius: 2, 
                px: 3, 
                py: 1,
                bgcolor: '#000000d1',
                color: 'white',
                '&:hover': {
                  bgcolor: '#333',
                }
              }}
              onClick={() => setOpen(true)}
            >
              + Create Post
            </Button>
          )}
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: '#000000d1' }} />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No posts yet. Be the first to share your thoughts!
            </Typography>
            {user && (
              <Button
                variant="outlined"
                sx={{ 
                  mt: 2,
                  borderColor: '#000000d1',
                  color: '#000000d1',
                  '&:hover': {
                    borderColor: '#000000d1',
                    bgcolor: '#000000d1',
                    color: 'white',
                  }
                }}
                onClick={() => setOpen(true)}
              >
                Create Your First Post
              </Button>
            )}
          </Box>
        ) : (
          <Stack spacing={3}>
            {posts.map((post) => (
              <Card 
                key={post._id} 
                elevation={4} 
                sx={{ 
                  borderRadius: 3, 
                  border: '1px solid #e0e0e0',
                  '&:hover': { 
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    borderColor: '#333'
                  } 
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Avatar sx={{ bgcolor: '#000000d1', color: 'white', width: 48, height: 48 }}>
                      {post.createdBy.name[0]}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold" variant="subtitle1">
                        {post.createdBy.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.4 }}>
                    {post.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    dangerouslySetInnerHTML={{
                      __html: post.body.length > 250 ? post.body.slice(0, 250) + '...' : post.body,
                    }}
                    sx={{ mb: 2 }}
                  />
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={user ? "Like" : "Log in to like"}>
                      <IconButton
                        onClick={() => toggleLike(post._id)}
                        disabled={!user}
                        sx={{ 
                          borderRadius: 2,
                          color: post.isLikedByUser ? '#000000d1' : 'grey.500',
                          '&:hover': {
                            color: '#000000d1',
                            bgcolor: 'grey.100'
                          }
                        }}
                      >
                        <ThumbUpIcon />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {post.likes.length}
                        </Typography>
                      </IconButton>
                    </Tooltip>

                    {user ? (
                      <Tooltip title="View & Comment">
                        <Button
                          size="small"
                          component={Link}
                          to={`/post/${post._id}`}
                          startIcon={<ForumIcon />}
                          variant="outlined"
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: 2,
                            px: 2,
                            py: 0.8,
                            fontSize: '0.85rem',
                            borderColor: '#000000d1',
                            color: '#000000d1',
                            '&:hover': {
                              bgcolor: '#000000d1',
                              color: 'white',
                              borderColor: '#000000d1',
                            }
                          }}
                        >
                          View & Comment
                        </Button>
                      </Tooltip>
                    ) : (
                      <Box
                        sx={{
                          border: '1px dashed',
                          borderColor: 'grey.400',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          bgcolor: 'grey.100',
                          color: 'text.secondary',
                          fontSize: '0.85rem',
                          mt: 1
                        }}
                      >
                        <ForumIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={500}>
                          Log in to view & comment
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create a New Post</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Post Title"
              fullWidth
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
              error={!newPost.title.trim() && open}
              helperText={!newPost.title.trim() && open ? "Title is required" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#000000d1',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#000000d1',
                },
              }}
            />
            <Box sx={{ minHeight: '250px', '& .ql-container': { minHeight: '200px' } }}>
              <ReactQuill
                theme="snow"
                value={newPost.body}
                onChange={(value) => setNewPost({ ...newPost, body: value })}
                placeholder="Write your post here..."
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpen(false)} 
            sx={{ 
              color: 'grey.600',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPost.title.trim() || !newPost.body.trim()}
            sx={{
              bgcolor: '#000000d1',
              color: 'white',
              '&:hover': {
                bgcolor: '#333',
              },
              '&:disabled': {
                bgcolor: 'grey.300',
                color: 'grey.500'
              }
            }}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;