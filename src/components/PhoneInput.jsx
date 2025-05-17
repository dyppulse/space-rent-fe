import React, { useState } from 'react';
import {
  TextField,
  Autocomplete,
  Grid,
  InputAdornment,
  Button,
} from '@mui/material';
import countries from 'world-countries';

// Format countries
console.log(countries, 'countriescountriescountries');
console.log(countries, 'countriescountries');
const formattedCountries = countries.map((country) => ({
  code: country.cca2,
  label: `${country.flag}-${country.cca2}`,
  // label: `${getFlagEmoji(country.cca2)} ${country.name.common} (${country.idd.root}${country.idd.suffixes[0]})`,
  phone: `${country.idd.root}${country.idd.suffixes[0]}`,
  name: country.name.common,
}));

// Get flag emoji from country code
function getFlagEmoji(code) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export default function PhoneInputFormik({ formik, formikValue }) {
  //   const formik = useFormik({
  //     initialValues: {
  //       country: formattedCountries[0],
  //       phoneNumber: '',
  //     },
  //     validationSchema: Yup.object({
  //       phoneNumber: Yup.string()
  //         .required('Phone number is required')
  //         .matches(/^\d+$/, 'Phone number must be digits only'),
  //     }),
  //     onSubmit: (values) => {
  //       const fullPhone = `${values.country.phone}${values.phoneNumber}`;
  //       alert(`Submitted phone: ${fullPhone}`);
  //     },
  //   });
  const [country, setCountry] = useState('');
  console.log(formik.values, 'dkjkdjkdjdkjdkj', country);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item size={{ xs: 5 }}>
        <Autocomplete
          options={formattedCountries}
          value={formik.values.country}
          onChange={(_, newValue) => {
            setCountry(newValue);
            formik.setFieldValue('country', newValue);
          }}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              variant="outlined"
              size="small"
            />
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
          onChange={(e) => {
            console.log(e.target.value, 'dkpkwpjdpkspkjpdj');
            formik.setFieldValue(formikValue, e.target.value);
          }}
          onBlur={formik.handleBlur}
          error={
            formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
          }
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  {country?.phone}
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
