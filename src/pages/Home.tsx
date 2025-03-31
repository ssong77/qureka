import React, { useState } from 'react';
import {
  Box, Button, Container, Typography, AppBar, Toolbar,
  IconButton, Link, Menu, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ImageIcon from '@mui/icons-material/Image';
import Logo from '../assets/images/logo.svg';

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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
  const handleStart = () => {
    if (isLoggedIn) {
      navigate('/upload');
    } else {
      alert('로그인이 필요합니다!');
      navigate('/login');
    }
  };
  return (
    <Box sx={{ bgcolor: '#f4f2f7', minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src={Logo} alt="Logo" style={{ height: '40px' }} />
          <Box>
            <Link href="#" underline="none" sx={{ mr: 2 }}>About us</Link>
            {isLoggedIn ? (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="outlined" size="small" onClick={() => navigate('/login')}>
                로그인
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          여러분들의 문서 도우미!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          다양한 문서들을 쉽게 작성할 수 있도록 도와드리니까
        </Typography>

        <Box sx={{ mt: 4, mb: 6 }}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleStart}>시작하기!</Button>
        </Box>

        <Box
          sx={{
            bgcolor: '#e9e8eb',
            height: 300,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <ImageIcon sx={{ fontSize: 64, color: '#b0b0b0' }} />
        </Box>
      </Container>
    </Box>
  );
}

export default Home;