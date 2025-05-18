// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import api from '../services/api'

interface User {
  id: number
  userid: string
  name: string
  email: string
}

interface AuthContextType {
  isLoggedIn: boolean
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  user: null,
  login: () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const isLoggedIn = Boolean(token)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    console.log('🔄 복원 시도 — storedToken:', storedToken)
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      console.log('🔄 Authorization 헤더 복원:', api.defaults.headers.common['Authorization'])
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    console.log('🔑 login 호출 — newToken:', newToken)
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    console.log('🔑 Authorization 헤더 설정:', api.defaults.headers.common['Authorization'])
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    console.log('🗝️ logout 호출 — 토큰 및 유저 정보 삭제')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
