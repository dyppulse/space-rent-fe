import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import axiosInstance from '../api/axiosInstance'



export const useAuth = () => {
   const [swalFire, setSwalFire] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { loading, error } = useSelector(state => state?.auth)

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
    }
  });

  useEffect(() => {
    if (loading) {
      setSwalFire(true)
    }
    if (swalFire) {
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Uh Oh Something is Wrong",
          html: error,
          confirmButtonText: "Try Again",
          confirmButtonColor: "#CE0610",
          allowOutsideClick: false,
          customClass: {
            container: "my-swal"
          }
        }).then(() => {
          setSwalFire(false)
        })
      }else {
      navigate('/dashboard')
      setSwalFire(false)
    }
    } 
  }, [loading])

  const logout = async () => {
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('token');
  };

  return {
    formik,
    loading, error,
    logout
  };
};
