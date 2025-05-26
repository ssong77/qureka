import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { backendAPI } from '../services/api'

export interface User {
  id: number
  userid: string
  name: string
  email?: string
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  login: (token: string, user: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const isLoggedIn = Boolean(token)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
      backendAPI.defaults.headers.common['Authorization'] = `Bearer ${t}`
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    backendAPI.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const logout = async () => {
    try {
      // 본문 없이 쿠키 기반 로그아웃 호출
      await backendAPI.post('/auth/logout')
    } catch (e) {
      console.warn('로그아웃 API 호출 중 에러', e)
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete backendAPI.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
