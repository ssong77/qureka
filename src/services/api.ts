// src/services/api.ts
import axios from 'axios'

// Node.js 백엔드 (인증, 사용자 관리 등)
export const backendAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // e.g. http://localhost:3000/api
  withCredentials: true,
})

// FastAPI (AI 요약/문제 생성)
// — withCredentials: false 로 설정해야 CORS wildcard(*)일 때에도 오류가 발생하지 않습니다.
export const aiAPI = axios.create({
  baseURL: import.meta.env.VITE_FASTAPI_URL, // e.g. http://localhost:8000/api
  withCredentials: false,
})

// 사용자 관련 API (Node.js 백엔드 사용)
export const userAPI = {
  checkUserid: (userid: string) =>
    backendAPI.post('/users/check-userid', { userid }),

  register: (data: {
    userid: string
    password: string
    name: string
    age: number
    gender: string
    phone: string
    email?: string
  }) =>
    backendAPI.post('/users/register', data),

  login: (userid: string, password: string) =>
    backendAPI.post('/users/login', { userid, password }),
}

// AI 요약 생성용 API (FastAPI 사용)
export const aiSummaryAPI = {
  generateSummary: (formData: FormData) =>
    aiAPI.post('/summarize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
}

// AI 문제 생성용 API (FastAPI 사용)
export const aiQuestionAPI = {
  generateQuestions: (data: any) =>
    aiAPI.post('/generate', data, {
      headers: { 'Content-Type': 'application/json' }
    }),
}

export default backendAPI
