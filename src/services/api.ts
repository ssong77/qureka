// src/services/api.ts
import axios from 'axios'

// Node.js 백엔드 (인증·저장·조회)
export const backendAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

// FastAPI (AI 생성 전용)
export const aiAPI = axios.create({
  baseURL: import.meta.env.VITE_FASTAPI_URL,
  withCredentials: false,
})

// 사용자 관리 API
export const userAPI = {
  checkUserid: (userid: string) =>
    backendAPI.post('/users/check-userid', { userid }),
  register: (data: any) =>
    backendAPI.post('/users/register', data),
  login: (userid: string, password: string) =>
    backendAPI.post('/users/login', { userid, password }),
}

// AI 요약 생성 API (FastAPI)
export const aiSummaryAPI = {
  generateSummary: (formData: FormData) =>
    aiAPI.post('/summarize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

// AI 문제 생성 API (FastAPI)
export const aiQuestionAPI = {
  generateQuestions: (data: any) =>
    aiAPI.post('/generate', data, {
      headers: { 'Content-Type': 'application/json' },
    }),
}

// ─── 요약 저장·조회 API (Node.js 백엔드) ─────────────────────────────────────────
export interface SummaryItem {
  selection_id: number
  file_name: string
  summary_type: string
  created_at: string
  summary_text: string    // ← 추가
}

export interface GetSummariesResponse {
  success: boolean
  count: number
  summaries: SummaryItem[]
}

export const summaryAPI = {
  getUserSummaries: (userId: number) =>
    backendAPI.get<GetSummariesResponse>(`/summaries/user/${userId}`),
  saveSummary: (data: {
    userId: number
    fileName: string
    summaryType: string
    summaryText: string
  }) =>
    backendAPI.post('/summaries', data),
}

// ─── 문제 저장·조회 API (Node.js 백엔드) ─────────────────────────────────────────
export interface QuestionItem {
  selection_id: number
  file_name: string
  question_type: string
  created_at: string
  question_text: string   // ← 추가
}

export interface GetQuestionsResponse {
  success: boolean
  count: number
  questions: QuestionItem[]
}

export const questionAPI = {
  getUserQuestions: (userId: number) =>
    backendAPI.get<GetQuestionsResponse>(`/questions/user/${userId}`),
  saveQuestion: (data: {
    userId: number
    fileName: string
    questionType: string
    questionText: string
  }) =>
    backendAPI.post('/questions', data),
}

export default backendAPI
