import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  CircularProgress, // Added for loading state
} from '@mui/material';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ForumIcon from '@mui/icons-material/Forum';
import Navbar from '../components/Navbar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const res = await axios.get('http://localhost:9000/api/posts/');
      // Assuming posts have a 'likedBy' array or similar to check if user liked it
      const postsWithLikeStatus = res.data.reverse().map(post => ({
        ...post,
        isLikedByUser: user ? post.likes.includes(user._id) : false, // Assuming 'likes' is an array of user IDs
      }));
      setPosts(postsWithLikeStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  const toggleLike = async (id) => {
    try {
      await axios.post(`http://localhost:9000/api/posts/${id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      fetchPosts(); // Refetch posts to update like status
    } catch (err) {
      console.error(err);
      // Optional: Show an error message to the user
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]); // Re-fetch if user changes (for like status)

  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      alert("Title and body cannot be empty.");
      return;
    }
    try {
      await axios.post('http://localhost:9000/api/posts', newPost, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      setOpen(false);
      setNewPost({ title: '', body: '' });
      fetchPosts();
    } catch (err) {
      console.error(err);
      // Optional: Show an error message to the user
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}> {/* Increased margin-bottom */}
          <Typography variant="h4" fontWeight="bold" color="text.primary"> {/* Emphasize color */}
            📝 Recent Posts
          </Typography>
          {user && (
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, px: 3, py: 1 }} // Added horizontal padding for better button size
              onClick={() => setOpen(true)}
            >
              + Create Post
            </Button>
          )}
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No posts yet. Be the first to share your thoughts!
            </Typography>
            {user && (
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setOpen(true)}
              >
                Create Your First Post
              </Button>
            )}
          </Box>
        ) : (
          <Stack spacing={3}>
            {posts.map((post) => (
              <Card key={post._id} elevation={4} sx={{ borderRadius: 3, '&:hover': { boxShadow: 6 } }}> {/* Higher elevation on hover */}
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>{post.createdBy.name[0]}</Avatar> {/* Larger avatar */}
                    <Box>
                      <Typography fontWeight="bold" variant="subtitle1">{post.createdBy.name}</Typography> {/* Slightly larger name */}
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.4 }}> {/* Improved line height */}
                    {post.title}
                  </Typography>

                  <Typography
                    variant="body1" // Use body1 for better readability
                    color="text.secondary"
                    dangerouslySetInnerHTML={{
                      __html: post.body.length > 250 ? post.body.slice(0, 250) + '...' : post.body, // Slightly more content
                    }}
                    sx={{ mb: 2 }} // Add margin below body
                  />
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={user ? "Like" : "Log in to like"}>
                      <IconButton
                        onClick={() => toggleLike(post._id)}
                        disabled={!user}
                        color={post.isLikedByUser ? "primary" : "default"} // Change color if liked
                        sx={{ borderRadius: 2 }}
                      >
                        <ThumbUpIcon />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>{post.likes.length}</Typography> {/* Display like count */}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View & Comment">
                      <Button
                        size="small"
                        component={Link}
                        to={`/post/${post._id}`}
                        startIcon={<ForumIcon />}
                        sx={{ textTransform: 'none' }} // Prevent uppercase
                      >
                        View & Comment
                      </Button>
                    </Tooltip>
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
              required // Mark as required
              error={!newPost.title.trim() && open} // Basic validation feedback
              helperText={!newPost.title.trim() && open ? "Title is required" : ""}
            />
            <Box sx={{ minHeight: '250px', '& .ql-container': { minHeight: '200px' } }}> {/* Increased height */}
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
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPost.title.trim() || !newPost.body.trim()} // Disable if fields are empty
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;