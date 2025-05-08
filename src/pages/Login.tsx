import React, { useState } from 'react';
import {

  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,


  Paper
} from '@mui/material';
import { Visibility, VisibilityOff, Home, Google } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = () => {
    if (email === '1234' && password === '1234') {
      login();
      navigate('/');
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <Box sx={{ bgcolor: '#f4f2f7', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            어서오세요!
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              placeholder="At least 12 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={2}>
              <FormControlLabel control={<Checkbox />} label="로그인 정보 기억" />
              <Link href="#" underline="none">비밀번호 찾기</Link>
            </Box>

            <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }} onClick={handleLogin}>
              Sign up
            </Button>

            <Box display="flex" justifyContent="center" gap={2} mt={1}>
              <IconButton><Google /></IconButton>
              <IconButton><Home /></IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary" mt={3}>
              계정이 없으신가요?{' '}
              <Link
                to="/signup"
                component={Link}
                underline="hover"
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                회원가입
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;