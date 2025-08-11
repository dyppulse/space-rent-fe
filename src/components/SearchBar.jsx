import { useState } from 'react'
import { Box, Paper, TextField, IconButton, Divider, InputAdornment, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

function SearchBar({ onSearch }) {
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [guests, setGuests] = useState('')

  const handleSearch = () => {
    onSearch?.({ location, startDate, endDate, guests })
  }

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 10,
        px: 1,
        py: 0.5,
        gap: 1,
        width: { xs: '100%', sm: 600 },
      }}
    >
      <TextField
        variant="standard"
        placeholder="Where to?"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon fontSize="small" />
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
        sx={{ flex: 1, px: 1 }}
      />
      <Divider orientation="vertical" flexItem />
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
        <CalendarTodayIcon fontSize="small" />
        <DatePicker
          value={startDate}
          onChange={setStartDate}
          slotProps={{
            textField: {
              variant: 'standard',
              placeholder: 'Start',
              sx: { width: 90 },
              InputProps: { disableUnderline: true },
            },
          }}
        />
        <DatePicker
          value={endDate}
          onChange={setEndDate}
          slotProps={{
            textField: {
              variant: 'standard',
              placeholder: 'End',
              sx: { width: 90 },
              InputProps: { disableUnderline: true },
            },
          }}
        />
      </Box>
      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
      <TextField
        variant="standard"
        placeholder="Guests"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PeopleAltIcon fontSize="small" />
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
        sx={{ width: { xs: 80, sm: 120 }, px: 1 }}
      />
      <IconButton
        color="primary"
        size="small"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
          ml: 0.5,
        }}
        onClick={handleSearch}
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Paper>
  )
}

export default SearchBar
