import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

//api here is an axios instance which has the baseURL set according to the env.
import api from '../services/api'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('token'), user_data = localStorage.getItem('user_data')
      if (token && user_data) {
        setUser(user_data)
      } else if(typeof window !== 'undefined' && window.location.pathname !== '/login/') {
        router.push('/login')
      }
      setLoading(false)
    }
    loadUserFromCookies()
  }, [])

  const login = async (email, password) => {
    try {
      const loginUser = await api.post('/login', { email, password })
      const token = loginUser.data.token, user_data = loginUser.data.data
      if (token && user_data) {
        Cookies.set('token', token, { expires: 60 })
        setUser(user_data)
        localStorage.setItem('user_data', JSON.stringify(user_data))
        router.push('/')
      }
    } catch (err){
      console.log(err)
    }
    setLoading(false)
  }

  const logout = (email, password) => {
    Cookies.remove('token')
    localStorage.removeItem('user_data')
    setUser(null)
    delete api.defaults.headers.Authorization
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const token = Cookies.get('token'), user_data = (typeof window !== 'undefined') ? localStorage.getItem('user_data') : ""

  if((!token || !user_data) && typeof window !== 'undefined' && window.location.pathname !== '/login/') {
    router.push('/login')
  }
  if (isLoading || (!isAuthenticated && typeof window !== 'undefined' &&
    window.location.pathname !== '/login/')) {
    return (<></>)
  }

  return children
}
