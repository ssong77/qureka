// src/pages/SignupPage.tsx
import React, { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { userAPI } from '../services/api'

interface SignUpForm {
  userId: string
  name: string
  age: string
  gender: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<SignUpForm>({
    userId: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (e: SelectChangeEvent<string>) => {
    setForm(prev => ({ ...prev, gender: e.target.value }))
  }

  const handleIdCheck = async () => {
    try {
      const { data } = await userAPI.checkUserid(form.userId)
      alert(data.message)
    } catch (err) {
      console.error(err)
      alert('중복 확인 중 오류가 발생했습니다.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await userAPI.register({
        userid: form.userId,
        name: form.name,
        age: Number(form.age),
        gender: form.gender,      // 'male' 또는 'female'
        phone: form.phone,
        email: form.email || undefined,
        password: form.password
      })
      alert('회원가입이 완료되었습니다.')
      navigate('/login')
    } catch (err: any) {
      console.error(err)
      alert('회원가입 실패: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <>
      <Header />
      <Container sx={{ mt: 8 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            p: 4,
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            회원가입
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                required
                name="userId"
                label="아이디"
                placeholder="사용할 아이디 입력"
                value={form.userId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ height: '100%' }}
                onClick={handleIdCheck}
              >
                중복 확인
              </Button>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                name="name"
                label="이름"
                placeholder="이름 입력"
                value={form.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                name="age"
                label="나이"
                type="number"
                placeholder="나이 입력"
                value={form.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>성별</InputLabel>
                <Select
                  name="gender"
                  label="성별"
                  value={form.gender}
                  onChange={handleGenderChange}
                >
                  <MenuItem value="">
                    <em>선택하세요</em>
                  </MenuItem>
                  <MenuItem value="male">남성</MenuItem>
                  <MenuItem value="female">여성</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                name="phone"
                label="전화번호"
                placeholder="010-1234-5678"
                value={form.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="이메일"
                type="email"
                placeholder="선택사항"
                value={form.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="password"
                label="비밀번호"
                type="password"
                placeholder="비밀번호 입력"
                value={form.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="confirmPassword"
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호 재입력"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit" size="large">
                회원가입
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}
