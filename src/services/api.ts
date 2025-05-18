// src/services/api.ts
import axios, { AxiosInstance } from 'axios'

const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. "http://localhost:3000/api"
  withCredentials: true,                  // 쿠키/세션 사용 시 필요
})

export const summaryAPI = {
  /**
   * 문서 파일을 업로드하고 요약을 생성합니다.
   * @param file PDF나 PPTX 파일
   */
  uploadAndSummarize(file: File) {
    const form = new FormData()
    form.append('file', file)
    return API.post('/summaries', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const questionAPI = {
  /**
   * 요약 ID를 기반으로 문제를 생성합니다.
   * @param payload summaryId, question_count, choice_count 등
   */
  generate(payload: {
    summaryId: string
    question_count?: number
    choice_count?: number
    answer_type?: string
    blank_count?: number
  }) {
    return API.post('/generated_questions', payload)
  },
}

export const userAPI = {
  /**
   * 아이디 중복 확인
   */
  checkUserId(payload: { userid: string }) {
    return API.post('/users/check-userid', payload)
  },
  /**
   * 회원가입 API
   * @param data { userid, password, name, age, gender, phone, email? }
   */
  register(data: {
    userid: string
    password: string
    name: string
    age: number
    gender: string
    phone: string
    email?: string
  }) {
    return API.post('/users/register', data)
  },
  /**
   * 로그인 API
   * @param credentials { userid, password }
   */
  login(credentials: { userid: string; password: string }) {
    return API.post('/auth/login', credentials)
  },
}
