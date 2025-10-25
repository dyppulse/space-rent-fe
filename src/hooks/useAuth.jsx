import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth as useAuthContext } from '../contexts/AuthContext'
import * as Yup from 'yup'

export const useAuth = () => {
  const navigate = useNavigate()
  const { login, user, isLoginLoading } = useAuthContext()
  const [loginError, setLoginError] = useState(null)

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: true,
    validateOnMount: false,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),

    onSubmit: async (values) => {
      try {
        setLoginError(null) // Clear any previous errors
        await login(values)
        // Navigation will be handled by the auth context
      } catch (error) {
        console.error('Login failed:', error)
        // Extract error message from backend response
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Login failed. Please try again.'
        setLoginError(errorMessage)
      }
    },
  })

  useEffect(() => {
    // When user is authenticated, handle navigation
    if (user) {
      const savedPath = localStorage.getItem('postLoginRedirect')
      if (savedPath) {
        localStorage.removeItem('postLoginRedirect')
        navigate(savedPath)
      } else if (user?.role === 'superadmin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, navigate])

  return {
    formik,
    isLoginLoading,
    loginError,
    clearLoginError: () => setLoginError(null),
  }
}
