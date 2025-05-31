import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PhoneInputFormik from '../components/PhoneInput';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../redux/slices/authSlice';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useState } from 'react';

function SignupPage() {
  const [swalFire, setSwalFire] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, signUpError } = useSelector(state => state?.auth)


  const validationSchema = yup.object({
    fullName: yup.string().required('Required').min(5, 'At least 5 characters'),
    email: yup.string().email('Invalid Email').required('Required'),
    password: yup
      .string()
      .required('required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'Password must contain at least one number and one special character'
      ),
    confirmPassword: yup
      .string()
      .required('required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    phoneNumber: yup
      .string()
      .required('Required')
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  });

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(signUp({
          name: values?.fullName,
        email: values?.email,
        password: values?.password,
        phone: values?.phoneNumber
      }))
    }
  });

  useEffect(() => {
    if (loading) {
      setSwalFire(true)
    }
    if (swalFire) {
      if (signUpError) {
        Swal.fire({
          icon: "error",
          title: "Uh Oh Something is Wrong",
          html: signUpError,
          confirmButtonText: "Try Again",
          confirmButtonColor: "#CE0610",
          allowOutsideClick: false,
          customClass: {
            container: "my-swal"
          }
        }).then(() => {
          setSwalFire(false)
        })
      } else {
        navigate('/dashboard')
        setSwalFire(false)
      }
    }
  }, [loading, navigate, signUpError, swalFire])


  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create an account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign up as a space owner to list your venue on our platform
          </Typography>
        </Box>

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            size="small"
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formik.values.fullName}
            onChange={(e) => formik.setFieldValue('fullName', e.target.value)}
            helperText={formik.errors.fullName}
            error={formik.errors.fullName}
          />
          <TextField
            fullWidth
            label="Phone number"
            variant="outlined"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            size="small"
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            onChange={(e) =>
              formik.setFieldValue('phoneNumber', e.target.value)
            }
          />
          <TextField
            margin="normal"
            size="small"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={(e) => formik.setFieldValue('email', e.target.value)}
            helperText={formik.errors.email}
            error={formik.errors.email}
          />
          <TextField
            margin="normal"
            size="small"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            helperText={formik.errors.password}
            error={formik.errors.password}
            value={formik.values.password}
            onChange={(e) => formik.setFieldValue('password', e.target.value)}
          />
          <TextField
            margin="normal"
            size="small"
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            helperText={formik.errors.confirmPassword}
            error={formik.errors.confirmPassword}
            value={formik.values.confirmPassword}
            onChange={(e) =>
              formik.setFieldValue('confirmPassword', e.target.value)
            }
          />

          <FormControlLabel
            control={<Checkbox value="terms" color="primary" />}
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link to="/terms">
                  <Typography component="span" variant="body2" color="primary">
                    terms of service
                  </Typography>
                </Link>{' '}
                and{' '}
                <Link to="/privacy">
                  <Typography component="span" variant="body2" color="primary">
                    privacy policy
                  </Typography>
                </Link>
              </Typography>
            }
            sx={{ mt: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Create account
          </Button>

          <Box sx={{ position: 'relative', my: 3 }}>
            <Divider />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'background.paper',
                px: 2,
              }}
            >
              Or continue with
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 6 }}>
              <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
                Google
              </Button>
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
                Facebook
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/auth/login">
                <Typography
                  component="span"
                  variant="body2"
                  color="primary"
                  fontWeight="medium"
                >
                  Log in
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignupPage;
