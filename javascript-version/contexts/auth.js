import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import themeConfig from 'src/configs/themeConfig'

//api here is an axios instance which has the baseURL set according to the env.
import api from '../services/api'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const unProtectedRoutes = themeConfig.unProtectedRoutes
  const homePageRoute = themeConfig.homePageRoute
  const loginPageRoute = themeConfig.loginPageRoute


  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('token'), user_data = localStorage.getItem('user_data')
      if (token && user_data) {
        setUser(user_data)
      } else if (typeof window !== 'undefined' && !unProtectedRoutes.includes(window.location.pathname)) {
        router.push(loginPageRoute)
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
        router.push(homePageRoute)
      } else {
        setLoading(false)

        return {err: true, message: (loginUser.data.message ?? 'Invalid Credentials')}
      }
    } catch (err){
      console.log(err)
      setLoading(false)

      return { err: true, message: err.message }
    }
    setLoading(false)

    return {err: false, message: 'Login success'}
  }

  const register = async (data) => {
    try {
      const registerUser = await api.post('/register', {
        name: data.username,
        email: data.email,
        password: data.password,
        gender: 'male'
      })

      const token = registerUser.data.token,
        user_data = registerUser.data.data
      if (token && user_data) {
        Cookies.set('token', token, { expires: 60 })
        setUser(user_data)
        localStorage.setItem('user_data', JSON.stringify(user_data))
        router.push(homePageRoute)
      } else {
        setLoading(false)

        return { err: true, message: (registerUser.data.message ?? 'Invalid Credentials') }
      }

    } catch (err) {
      console.log(err)
      setLoading(false)

      return { err: true, message: err.message }
    }
    setLoading(false)

    return { err: false, message: 'Register success' }
  }

  const logout = (token, redirectLocation) => {
    Cookies.remove('token')
    localStorage.removeItem('user_data')
    setUser(null)
    delete api.defaults.headers.Authorization
    router.push(redirectLocation || loginPageRoute)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, loading, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const token = Cookies.get('token'), user_data = (typeof window !== 'undefined') ? localStorage.getItem('user_data') : ""
  const unProtectedRoutes = themeConfig.unProtectedRoutes
  const loginPageRoute = themeConfig.loginPageRoute

  if (
    (!token || !user_data) &&
    typeof window !== 'undefined' && !unProtectedRoutes.includes(window.location.pathname)
    ) {
    router.push(loginPageRoute)
  }
  if (
    isLoading ||
    (!isAuthenticated &&
      typeof window !== 'undefined' && !unProtectedRoutes.includes(window.location.pathname))
  ) {
    return <></>
  }

  return children
}
