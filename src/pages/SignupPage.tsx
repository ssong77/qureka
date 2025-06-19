import React, { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack
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
    // 입력 값 검증
    if (!form.userId.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      const { data } = await userAPI.checkUserid(form.userId)
      alert(data.message) // 성공 메시지 표시 (예: "사용 가능한 아이디입니다.")
    } catch (err: any) {
      // 백엔드에서 오는 실제 오류 메시지 표시
      if (err.response?.data?.message) {
        alert(err.response.data.message); // "이미 사용 중인 아이디입니다." 같은 메시지 표시
      } else {
        alert('중복 확인 중 오류가 발생했습니다.');
      }
      console.error('ID 중복 확인 오류:', err);
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
        gender: form.gender,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password
      })
      alert('회원가입이 완료되었습니다.')
      navigate('/login')
    } catch (err: any) {
      alert('회원가입 실패: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <>
      <Header />
      <Container 
        maxWidth="sm"            // sm: 약 600px 폭 제한
        sx={{ mt: 8 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            p: 4,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            회원가입
          </Typography>

          <Stack spacing={3}>
            {/* 1행: 아이디 + 중복확인 */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                required
                name="userId"
                label="아이디"
                placeholder="사용할 아이디 입력"
                value={form.userId}
                onChange={handleChange}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleIdCheck}
                sx={{ width: 120 }}
              >
                중복 확인
              </Button>
            </Stack>

            {/* 2행: 이름 + 나이 */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                required
                name="name"
                label="이름"
                placeholder="이름 입력"
                value={form.name}
                onChange={handleChange}
                sx={{ flex: 1 }}
              />
              <TextField
                fullWidth
                required
                name="age"
                label="나이"
                type="number"
                placeholder="나이 입력"
                value={form.age}
                onChange={handleChange}
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* 3행: 성별 + 전화번호 */}
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth required sx={{ flex: 1 }}>
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
              <TextField
                fullWidth
                required
                name="phone"
                label="전화번호"
                placeholder="010-1234-5678"
                value={form.phone}
                onChange={handleChange}
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* 4행: 이메일 */}
            <TextField
              fullWidth
              name="email"
              label="이메일"
              type="email"
              placeholder="이메일 입력 (선택사항)"
              value={form.email}
              onChange={handleChange}
            />

            {/* 5행: 비밀번호 */}
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

            {/* 6행: 비밀번호 확인 */}
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

            {/* 회원가입 버튼 */}
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" type="submit" sx={{ width: 200, height: 48 }}>
                회원가입
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    </>
  )
}
