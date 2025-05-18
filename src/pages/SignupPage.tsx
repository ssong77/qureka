// src/pages/SignupPage.tsx
import React, { useState } from 'react'
import styled from 'styled-components'
import { userAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const AuthFormContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  margin: 2rem auto;
`
const Title = styled.h2`
  margin: 0 0 1.5rem;
  text-align: center;
`
const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`
const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`
const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`
const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
`
const DupCheckButton = styled.button`
  margin-left: 0.5rem;
  padding: 0 1rem;
  background-color: #666;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    userid: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  // 아이디 중복 확인
  const handleDupCheck = async () => {
    if (!form.userid.trim()) {
      return alert('아이디를 입력하세요.')
    }
    try {
      const res = await userAPI.checkUserId({ userid: form.userid.trim() })
      const { success, message } = res.data as {
        success: boolean
        message: string
      }
      alert(success ? `✅ ${message}` : `❌ ${message}`)
    } catch (err) {
      console.error('중복확인 에러:', err)
      alert('아이디 확인 중 오류가 발생했습니다.')
    }
  }

  // 회원가입 제출
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.')
    }
    setLoading(true)

    // 필수 필드만 먼저 담고
    const payload: {
      userid: string
      password: string
      name: string
      age: number
      gender: string
      phone: string
      email?: string
    } = {
      userid: form.userid.trim(),
      password: form.password,
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone.trim(),
    }

    // 이메일이 있으면 추가
    if (form.email.trim()) {
      payload.email = form.email.trim()
    }

    try {
      const res = await userAPI.register(payload)
      console.log('회원가입 응답:', res.data)
      alert('✅ 회원가입이 완료되었습니다.')
      navigate('/login')
    } catch (err: any) {
      console.error('회원가입 에러:', err.response?.data || err)
      alert(`❌ 회원가입에 실패했습니다.\n${err.response?.data?.message || ''}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <AuthFormContainer>
        <Title>회원가입</Title>
        <AuthForm onSubmit={handleSubmit}>
          <FormGroup style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Label style={{ flex: 1 }}>아이디 *</Label>
            <div style={{ flex: 3, display: 'flex' }}>
              <Input
                name="userid"
                value={form.userid}
                onChange={handleChange}
                placeholder="사용할 아이디 입력"
                required
              />
              <DupCheckButton type="button" onClick={handleDupCheck}>
                중복 확인
              </DupCheckButton>
            </div>
          </FormGroup>

          <FormGroup style={{ flexDirection: 'row', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <Label>이름 *</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름 입력"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>나이 *</Label>
              <Input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder="나이 입력"
                required
              />
            </div>
          </FormGroup>

          <FormGroup style={{ flexDirection: 'row', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <Label>성별 *</Label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <Label>전화번호 *</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="예: 010-1234-5678"
                required
              />
            </div>
          </FormGroup>

          <FormGroup>
            <Label>이메일 (선택)</Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일 주소 입력"
            />
          </FormGroup>

          <FormGroup style={{ flexDirection: 'row', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <Label>비밀번호 *</Label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호 입력"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>비밀번호 확인 *</Label>
              <Input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호 다시 입력"
                required
              />
            </div>
          </FormGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '처리 중...' : '회원가입'}
          </SubmitButton>
        </AuthForm>
      </AuthFormContainer>
    </>
  )
}
