// src/components/Navbar.js
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Divider,
    useTheme,
    alpha
  } from '@mui/material';
  import { 
    AccountCircle, 
    LogoutOutlined, 
    PersonOutlined,
    ChatBubbleOutline 
  } from '@mui/icons-material';
  import { Link, useNavigate } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';
  import { useState } from 'react';
  
  const Navbar = () => {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(false);
    };
  
    const handleLogout = () => {
      logout();
      handleMenuClose();
      navigate('/');
    };
  
    const getInitials = (name) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };
  
    return (
   <Box sx={{display:"flex", justifyContent:'center'}}>

<AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}


      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          minHeight: '70px !important',
          px: { xs: 2, md: 4 }
        }}>
          {/* Logo Section */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            <ChatBubbleOutline sx={{ mr: 1.5, fontSize: 28 }} />
            <Typography 
              variant="h5" 
              component="div"
              sx={{ 
                fontWeight: 700,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              PostComment
            </Typography>
          </Box>
  
          {/* Navigation Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                {/* Welcome Message - Hidden on mobile */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(theme.palette.common.white, 0.9),
                    mr: 2,
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 500
                  }}
                >
                  Welcome back, {user.name.split(' ')[0]}
                </Typography>
  
                {/* User Avatar Menu */}
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    p: 0,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha(theme.palette.common.white, 0.15),
                      color: theme.palette.common.white,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.common.white, 0.25),
                      }
                    }}
                  >
                    {getInitials(user.name)}
                  </Avatar>
                </IconButton>
  
                {/* User Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 8,
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        }
                      }
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleMenuClose} disabled>
                    <PersonOutlined sx={{ mr: 2, fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <MenuItem onClick={handleLogout}>
                    <LogoutOutlined sx={{ mr: 2, fontSize: 20 }} />
                    <Typography variant="body2">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{
                    color: theme.palette.common.white,
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Login
                </Button>
                
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.common.white,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.95),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.2)}`,
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
   </Box>
    );
  };
  
  export default Navbar;