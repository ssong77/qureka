import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  InputAdornment
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function SignupPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <Header />
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 500, // ✅ 너비 확대
            mx: 'auto',
            textAlign: 'center',
            px: 2, // ✅ 모바일 대응 padding
          }}
        >
          <Box mb={2}>
            <img src="/box-icon.png" alt="Inventory Logo" style={{ height: 48 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" mb={4}>
            Inventory
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder="Company Name"
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: '#e5e7eb', // gray-200
                  borderRadius: 1,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder="Email"
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: '#e5e7eb',
                  borderRadius: 1,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder="Phone Number"
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: '#e5e7eb',
                  borderRadius: 1,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                placeholder="Password"
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: '#e5e7eb',
                  borderRadius: 1,
                }}
              />
            </Grid>

            <Grid item xs={12} textAlign="left">
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography variant="body2">
                    I agree with <strong>Terms & Conditions</strong>
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth // ✅ 텍스트필드와 너비 일치
                variant="contained"
                sx={{
                  backgroundColor: '#374151', // gray-700
                  color: 'white',
                  paddingY: '10px',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#1f2937', // gray-800
                  },
                }}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate('/login')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  p: 0,
                  minWidth: 'auto',
                }}
              >
                Sign in
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SignupPage;
