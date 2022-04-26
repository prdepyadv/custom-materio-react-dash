// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

import { useAuth } from '../../../contexts/auth'

const LoginPage = () => {

  const auth = useAuth()

  useEffect(() => {
    auth.logout()
  })

  return (
    <div>Hang On! Logging out....</div>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
