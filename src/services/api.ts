// src/services/api.ts
import axios from 'axios'

// Node.js 백엔드 (인증·저장·조회)
export const backendAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // 예: http://localhost:3000/api
  withCredentials: true,                     // 쿠키 전송 허용
})

// FastAPI (AI 생성 전용)
export const aiAPI = axios.create({
  baseURL: import.meta.env.VITE_FASTAPI_URL, // 예: http://localhost:8000/api
  withCredentials: false,
})

// ─── 사용자 관리 API ────────────────────────────────────────────────────────────
export const userAPI = {
  checkUserid: (userid: string) =>
    backendAPI.post('/users/check-userid', { userid }),
  register: (data: any) =>
    backendAPI.post('/users/register', data),
  login: (userid: string, password: string, rememberMe = false) =>
    backendAPI.post('/users/login', { userid, password, rememberMe }),
  verifyToken: () =>
    backendAPI.get<{
      success: boolean
      user: { id: number; userid: string; name: string; rememberMe: boolean }
    }>('/auth/verify'),
  refreshToken: () =>
    backendAPI.post<{
      success: boolean
      accessToken: string
      user: { id: number; userid: string; name: string }
    }>('/auth/refresh-token'),
  logout: () =>
    backendAPI.post('/auth/logout'),
}

// ─── AI 요약/문제 생성 API (FastAPI) ──────────────────────────────────────────────
export const aiSummaryAPI = {
  generateSummary: (formData: FormData) =>
    aiAPI.post('/summarize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const aiQuestionAPI = {
  generateQuestions: (data: any) =>
    aiAPI.post('/generate', data, {
      headers: { 'Content-Type': 'application/json' },
    }),
}


// ─── 요약 저장·조회 API (Node.js 백엔드) ─────────────────────────────────────────
export interface SummaryItem {
  selection_id: number
  user_id: number
  file_name: string
  summary_type: string
  mongo_summary_id: string
  created_at: string
  summary_text?: string
}

export interface GetSummariesResponse {
  success: boolean
  count: number
  summaries: SummaryItem[]
}

export const summaryAPI = {
  getUserSummaries: (userId: number) =>
    backendAPI.get<GetSummariesResponse>(`/summaries/user/${userId}`),
  getUserSummariesMeta: (userId: number) =>
    backendAPI.get<GetSummariesResponse>(`/summaries/user/${userId}/meta`),
  getSummaryById: (id: number) =>
    backendAPI.get<{
      success: boolean
      summary: SummaryItem & { summary_text: string }
    }>(`/summaries/${id}`),
  saveSummary: (data: {
    userId: number
    fileName: string
    summaryType: string
    summaryText: string
  }) =>
    backendAPI.post('/summaries', data),
  deleteSummary: (id: number) =>
    backendAPI.delete(`/summaries/${id}`),
}

// ─── 문제 저장·조회 API (Node.js 백엔드) ─────────────────────────────────────────
export interface QuestionItem {
  selection_id: number
  user_id: number
  file_name: string
  question_type: string
  mongo_question_id: string
  created_at: string
  question_text?: string
}

export interface GetQuestionsResponse {
  success: boolean
  count: number
  questions: QuestionItem[]
}

export const questionAPI = {
  getUserQuestions: (userId: number) =>
    backendAPI.get<GetQuestionsResponse>(`/questions/user/${userId}`),
  getUserQuestionsMeta: (userId: number) =>
    backendAPI.get<GetQuestionsResponse>(`/questions/user/${userId}/meta`),
  getQuestionById: (id: number) =>
    backendAPI.get<{
      success: boolean
      question: QuestionItem & { question_text: string }
    }>(`/questions/${id}`),
  saveQuestion: (data: {
    userId: number
    fileName: string
    questionType: string
    questionText: string
  }) =>
    backendAPI.post('/questions', data),
  deleteQuestion: (id: number) =>
    backendAPI.delete(`/questions/${id}`),
}

export default backendAPI
