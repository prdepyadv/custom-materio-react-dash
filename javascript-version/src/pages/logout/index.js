// ** React Imports
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

import { useAuth } from '../../../contexts/auth'

const LoginPage = () => {

  const auth = useAuth()
  const loginPageRoute = themeConfig.loginPageRoute

  useEffect(() => {
    const token = Cookies.get('token')
    auth.logout(token ?? '', loginPageRoute)
  })

  return (
    <div>Hang On! Logging out....</div>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
