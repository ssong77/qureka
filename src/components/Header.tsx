import React, { useState } from 'react'; 
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoImage from '../assets/images/큐레카_로고 이미지.png'; // 로고 이미지 경로 예시

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const handleMypage = () => {
    handleMenuClose();
    navigate('/mypage');
  };

  return (
    <AppBar position="static" color="transparent" elevation={3}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={LogoImage} alt="Logo" style={{ height: 40, marginRight: 8 }} />
        </Box>

        <Box>
          <Link href="#" underline="none" sx={{ mr: 2 }}>
            About Us
          </Link>
          {isLoggedIn ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <AccountCircle fontSize="large" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMypage}>마이페이지</MenuItem>
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
  );
}

export default Header;
