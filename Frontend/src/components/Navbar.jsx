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
  import { useAuth } from '../context/AuthContext.jsx';
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
      setAnchorEl(null);
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
      <Box sx={{ display: "flex", justifyContent: 'center' }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            background: '#000000d1',
            borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, #ffffff 20%, #ffffff 80%, transparent 100%)',
              opacity: 0.3
            }
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
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <ChatBubbleOutline 
                sx={{ 
                  mr: 1.5, 
                  fontSize: 28,
                  color: '#ffffff',
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
                }} 
              />
              <Typography 
                variant="h5" 
                component="div"
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  color: '#ffffff',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    textShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                  }
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
                      color: alpha('#ffffff', 0.9),
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
                        bgcolor: '#ffffff',
                        color: '#000000d1',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        border: `2px solid ${alpha('#ffffff', 0.8)}`,
                        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          bgcolor: alpha('#ffffff', 0.9),
                          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
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
                      elevation: 12,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                        bgcolor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1.5,
                          borderRadius: 1,
                          mx: 1,
                          my: 0.5,
                          color: '#000000d1',
                          '&:hover': {
                            bgcolor: '#f5f5f5',
                            color: '#000000d1',
                          },
                          '&.Mui-disabled': {
                            opacity: 1,
                            color: '#000000d1',
                          }
                        }
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleMenuClose} disabled>
                      <PersonOutlined sx={{ mr: 2, fontSize: 20, color: '#666666' }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="#000000d1">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="#666666">
                          {user.email}
                        </Typography>
                      </Box>
                    </MenuItem>
                    
                    <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                    
                    <MenuItem onClick={handleLogout}>
                      <LogoutOutlined sx={{ mr: 2, fontSize: 20, color: '#666666' }} />
                      <Typography variant="body2" color="#000000d1">Logout</Typography>
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
                      color: '#ffffff',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      border: '1px solid transparent',
                      '&:hover': {
                        bgcolor: alpha('#ffffff', 0.1),
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)',
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
                      bgcolor: '#ffffff',
                      color: '#000000d1',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      border: '1px solid #ffffff',
                      boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        bgcolor: alpha('#ffffff', 0.9),
                        color: '#000000d1',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(255, 255, 255, 0.3)',
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