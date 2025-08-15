import React from 'react'
import { TextField, Autocomplete, Grid, InputAdornment } from '@mui/material'
import countries from 'world-countries'

function getFlagEmoji(code) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

const formattedCountries = countries.map((country) => {
  const dial = `${country.idd?.root ?? ''}${country.idd?.suffixes?.[0] ?? ''}`
  return {
    code: country.cca2,
    label: `${getFlagEmoji(country.cca2)} ${country.name.common} (${dial})`,
    phone: dial,
    name: country.name.common,
  }
})

export default function PhoneInputFormik({ formik, formikValue }) {
  const selected = formik.values.country || null

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item size={{ xs: 5 }}>
        <Autocomplete
          options={formattedCountries}
          value={selected}
          onChange={(_, newValue) => {
            formik.setFieldValue('country', newValue)
          }}
          isOptionEqualToValue={(opt, val) => opt.code === val?.code}
          getOptionLabel={(option) => option?.label || ''}
          renderInput={(params) => (
            <TextField {...params} label="Country" variant="outlined" size="small" />
          )}
        />
      </Grid>
      <Grid item size={{ xs: 7 }}>
        <TextField
          fullWidth
          label="Phone number"
          variant="outlined"
          name="phoneNumber"
          value={formik.values.phoneNumber}
          size="small"
          onChange={(e) => formik.setFieldValue(formikValue, e.target.value)}
          onBlur={formik.handleBlur}
          error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          InputProps={{
            startAdornment: <InputAdornment position="start">{selected?.phone}</InputAdornment>,
          }}
        />
      </Grid>
    </Grid>
  )
}
