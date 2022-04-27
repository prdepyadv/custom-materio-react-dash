import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import api from 'services/api'
import Grid from '@mui/material/Grid'
import FormLayoutsBasic from 'src/views/form-layouts/FormLayoutsBasic'

const User = () => {
  const router = useRouter()
  const { pid } = router.query
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadUser() {
      if (!pid) {
        return
      }

      const token = Cookies.get('token')
      api.defaults.headers.Authorization = `bearer ${token}`
      api
        .get('/users/' + pid)
        .then(res => {
          setUser(res.data.data)
        })
        .catch(err => {
          console.log(err)
          setUser([])
        })
    }

    loadUser()
  }, [pid])

  const editUser = (event, values) => {
    event.preventDefault()
    if (!pid || !values.username || !values.email) {
      return
    }

    //return router.push('/users')

    const token = Cookies.get('token')
    api.defaults.headers.Authorization = `bearer ${token}`
    api
      .put('/updateUser/' + pid,
       {
        name: values.username,
        email: values.email,
        
        // isActive: true
       }
      )
      .then(res => {
        router.push('/users')
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>
        <FormLayoutsBasic user={user} editUser={editUser} />
      </Grid>
    </Grid>
  )
}

export default User
