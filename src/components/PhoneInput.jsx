import React from 'react'
import PhoneInput from 'react-phone-number-input'
import { FormHelperText, useTheme } from '@mui/material'
import 'react-phone-number-input/style.css'

export default function PhoneInputFormik({
  formik,
  formikValue = 'phoneNumber',
  defaultCountry = 'UG',
  size = 'medium',
}) {
  const theme = useTheme()
  const value = formik.values[formikValue]
  const error = formik.errors[formikValue]
  const touched = formik.touched[formikValue]

  const isSmall = size === 'small'
  const inputHeight = isSmall ? '40px' : '56px'
  const inputPadding = isSmall ? '8.5px 14px' : '0 14px'
  const buttonPadding = isSmall ? '0 8px' : '0 12px'

  const borderColor =
    touched && error
      ? theme.palette.error.main
      : theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300]

  const focusColor = touched && error ? theme.palette.error.main : theme.palette.primary.main
  const bgColor = theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#fff'
  const textColor = theme.palette.text.primary

  return (
    <div>
      <PhoneInput
        international
        defaultCountry={defaultCountry}
        value={value}
        onChange={(value) => formik.setFieldValue(formikValue, value || '')}
        onBlur={() => formik.setFieldTouched(formikValue, true)}
        error={touched && Boolean(error)}
        className="phone-input"
        numberInputProps={{
          className: 'phone-input-number',
          'data-theme': theme.palette.mode,
        }}
        style={{
          '--PhoneInput-color--focus': focusColor,
          '--PhoneInputInternationalIconPhone-opacity': '0.8',
          '--PhoneInputInternationalIconGlobe-opacity': '0.8',
        }}
      />
      <style>{`
        .phone-input {
          width: 100%;
          --PhoneInputCountryFlag-borderColor: transparent;
        }
        .phone-input input {
          width: 100%;
          height: ${inputHeight};
          padding: ${inputPadding};
          border: 1px solid ${borderColor} !important;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
          background-color: ${bgColor};
          color: ${textColor};
          transition: border-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }
        .phone-input input:hover {
          border-color: ${theme.palette.text.secondary};
        }
        .phone-input input:focus {
          outline: 2px solid ${focusColor} !important;
          outline-offset: -2px;
          border-color: ${focusColor} !important;
        }
        .phone-input input.Mui-error {
          border-color: ${theme.palette.error.main} !important;
        }
        .phone-input__button {
          height: ${inputHeight};
          padding: ${buttonPadding};
          background-color: ${bgColor};
          color: ${textColor};
          border: 1px solid ${borderColor};
          border-right: none;
          border-radius: 4px 0 0 4px;
        }
        .phone-input__button:hover {
          background-color: ${theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100]};
        }
        .phone-input__country-select {
          background-color: ${bgColor};
          color: ${textColor};
        }
        .phone-input__country-select-arrow {
          opacity: 0.7;
          color: ${textColor};
        }
        .PhoneInputCountryIcon {
          border: 1px solid ${theme.palette.divider};
        }
      `}</style>
      {touched && error && (
        <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
          {error}
        </FormHelperText>
      )}
    </div>
  )
}
