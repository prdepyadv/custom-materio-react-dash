// ** React Imports
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

import { useAuth } from '../../../contexts/auth'

const LoginPage = () => {

  const auth = useAuth()

  useEffect(() => {
    const token = Cookies.get('token')
    auth.logout(token ?? '', '/login')
  })

  return (
    <div>Hang On! Logging out....</div>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
