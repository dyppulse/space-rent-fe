import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../redux/slices/authSlice'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'
import * as Yup from 'yup'
import axiosInstance from '../api/axiosInstance'

export const useAuth = () => {
  const [open, setOpen] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading, error, user } = useSelector((state) => state?.auth)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),

    onSubmit: (values) => {
      dispatch(login(values))
    },
  })

  useEffect(() => {
    // Show modal while the login request is in-flight
    if (loading && !open) setOpen(true)

    // When request finishes, decide where to go and close modal
    if (!loading && open) {
      if (!error && user) {
        const savedPath = localStorage.getItem('postLoginRedirect')
        if (savedPath) {
          localStorage.removeItem('postLoginRedirect')
          navigate(savedPath)
        } else if (user?.role === 'superadmin') {
          navigate('/admin/taxonomies')
        } else {
          navigate('/dashboard')
        }
      }
      setOpen(false)
    }
  }, [error, loading, navigate, open, user])

  const logout = async () => {
    await axiosInstance.post('/auth/logout')
  }

  return {
    formik,
    loading,
    error,
    logout,
    LoginStatusModal: (
      <Dialog open={open && loading} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Logging you in…</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Please wait while we prepare your dashboard.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    ),
  }
}
