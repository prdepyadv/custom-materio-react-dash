// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import themeConfig from 'src/configs/themeConfig'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import api from 'services/api'
import Pencil from 'mdi-material-ui/Pencil'
import BicycleBasket from 'mdi-material-ui/DeleteCircle'
import ReactLoading from 'react-loading'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

const Users = () => {
  // ** State
  const [values, setValues] = useState({
    users: [],
    isUserDataAvailable: false,
    error: ''
  })
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const router = useRouter()
  const loginPageRoute = themeConfig.loginPageRoute

  async function loadUsers() {
    const user_data = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : ''
    const token = Cookies.get('token')
    setToken(token)
    setUser(user_data)
    api.defaults.headers.Authorization = `bearer ${token}`
    api
      .get('/users')
      .then(res => {
        setValues({ ...values, users: res.data.data, isUserDataAvailable: true, error: '' })
      })
      .catch(err => {
        console.log(err)
        setValues({ ...values, users: [], isUserDataAvailable: false, error: err.message })
      })
  }
  useEffect(() => {
    loadUsers()

    return () => {
      setValues({})
      setUser('')
      setToken('')
      setRowsPerPage(10)
      setPage(0)
    }
  }, [])

  const deleteUser = (id) => {
    api.defaults.headers.Authorization = `bearer ${token}`
    api.delete('/users/'+id)
      .then(res => {
        loadUsers()
      })
      .catch(err => {
        console.log(err)
        setValues({ ...values, error: err.message })
      })
  }

  const editUser = (id) => {
    if(!id){

      return false
    }
    router.push('/user/'+id)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Users Table' titleTypographyProps={{ variant: 'h6' }} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>S. No.</StyledTableCell>
                  <StyledTableCell align='right'>Name</StyledTableCell>
                  <StyledTableCell align='right'>Email</StyledTableCell>
                  <StyledTableCell align='right'>Gender</StyledTableCell>
                  <StyledTableCell align='right'>Status</StyledTableCell>
                  <StyledTableCell align='right'>Action</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {values.isUserDataAvailable ? (
                  values.users
                    .filter(function (data) {
                      return data._id != user._id
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <StyledTableRow key={row._id}>
                        <StyledTableCell component='th' scope='row'>
                          {index + 1 + page * rowsPerPage}
                        </StyledTableCell>
                        <StyledTableCell align='right'>{row.name}</StyledTableCell>
                        <StyledTableCell align='right'>{row.email}</StyledTableCell>
                        <StyledTableCell align='right'>{row.gender}</StyledTableCell>
                        <StyledTableCell align='right'>
                          {row.isActive == 'true' ? 'Active' : 'Disabled'}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {row.isActive == 'true' ? (
                            <>
                              <Pencil
                                onClick={() => editUser(row._id)}
                                sx={{ marginRight: '5px', cursor: 'pointer' }}
                              />
                              <BicycleBasket sx={{ cursor: 'pointer' }} onClick={() => deleteUser(row._id)} />
                            </>
                          ) : (
                            '---'
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                ) : (
                  <StyledTableRow key='0'>
                    <StyledTableCell component='th' align='center' colSpan='100%' scope='row'>
                      <Box sx={{ width: '100%', height: '40px' }}>
                        <LinearProgress />
                        {/* <ReactLoading type='cylon' color='#0000FF' /> */}
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={
              values.users
                ? values.users.filter(function (data) {
                    return data._id != user._id
                  }).length
                : 0
            }
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default Users
