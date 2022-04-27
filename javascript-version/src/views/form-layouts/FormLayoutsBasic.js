// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const FormLayoutsBasic = (props) => {
  // ** States
  const [values, setValues] = useState({
    username: '',
    email: ''
  })

  useEffect(() => {
    setValues({ ...values, username: props.user ? props.user.name : '', email: props.user ? props.user.email : '' })

  }, [props])

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  return (
    <Card>
      <CardHeader title='Edit User' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={e => props.editUser ? props.editUser(e, values) : e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='username'
                value={values.username}
                onChange={handleChange('username')}
                label='Name'
                placeholder='Name'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='email'
                id='email'
                label='Email'
                disabled='true'
                value={values.email}
                onChange={handleChange('email')}
                helperText='You can use letters, numbers & periods'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button type='submit' variant='contained' size='large'>
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormLayoutsBasic
