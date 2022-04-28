import { useRouter } from 'next/router'
import * as React from 'react'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import api from 'services/api'
import Grid from '@mui/material/Grid'
import FormLayoutsBasic from 'src/views/form-layouts/FormLayoutsBasic'
import { Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const User = () => {
  const router = useRouter()
  const { pid } = router.query
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState({
    open: false,
    type: 'success',
    vertical: 'top',
    horizontal: 'center',
    text: ''
  })

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setMessage({...message, open: false})
  }

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

    setUser({...user, name: values.username})
    const token = Cookies.get('token')
    api.defaults.headers.Authorization = `bearer ${token}`
    api.put('/updateUser/' + pid,
       {
        name: values.username,
        email: values.email,

        // isActive: true
       }
      )
      .then(res => {
        setMessage({...message, open: true, text: 'User updated.', type: 'success'})
        setTimeout(() => {
          router.push('/users')
        }, 2000)
      })
      .catch(err => {
        console.log(err)
        if (err.response && err.response.status == 401) {
          setMessage({ ...message, open: true, text: 'Unauthorized request.', type: 'error' })
        }
      })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>
        <FormLayoutsBasic user={user} editUser={editUser} />
        <Snackbar
          open={message.open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={message}
          key={message.vertical + message.horizontal}
        >
          <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
            {message.text}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  )
}

export default User
