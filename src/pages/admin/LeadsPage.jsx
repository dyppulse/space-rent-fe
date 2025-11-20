import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Skeleton,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import {
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { leadService } from '../../api/services/leadService'

const LeadDetailDialog = ({ open, onClose, lead, onStatusUpdate }) => {
  const [status, setStatus] = useState(lead?.status || 'new')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (lead) {
      setStatus(lead.status)
    }
  }, [lead])

  const handleStatusUpdate = async () => {
    if (!lead || status === lead.status) {
      onClose()
      return
    }

    try {
      setUpdating(true)
      await leadService.updateLeadStatus(lead.id, status)
      onStatusUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating lead status:', error)
      alert(error.response?.data?.message || 'Error updating lead status')
    } finally {
      setUpdating(false)
    }
  }

  if (!lead) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Lead Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Name
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {lead.name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
            </Box>
            <Typography variant="body1">{lead.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Phone
              </Typography>
            </Box>
            <Typography variant="body1">{lead.phone}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Event Type
              </Typography>
            </Box>
            <Typography variant="body1">{lead.eventType}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Event Date
              </Typography>
            </Box>
            <Typography variant="body1">
              {format(new Date(lead.eventDate), 'MMM dd, yyyy')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                City / Location
              </Typography>
            </Box>
            <Typography variant="body1">{lead.city}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Guest Count
              </Typography>
            </Box>
            <Typography variant="body1">{lead.guestCount} guests</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <MoneyIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Budget Range
              </Typography>
            </Box>
            <Typography variant="body1">{lead.budgetRange}</Typography>
          </Grid>
          {lead.notes && (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" mb={1}>
                Special Notes
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2">{lead.notes}</Typography>
              </Paper>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="textSecondary">
              Submitted: {format(new Date(lead.createdAt), 'MMM dd, yyyy HH:mm')}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleStatusUpdate} variant="contained" disabled={updating}>
          {updating ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const LeadsPage = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [detailDialog, setDetailDialog] = useState({ open: false, lead: null })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    fetchLeads()
  }, [page, rowsPerPage, statusFilter])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      }
      if (statusFilter) params.status = statusFilter

      const response = await leadService.getLeads(params)
      setLeads(response.data || [])
      setTotal(response.pagination?.total || 0)
    } catch (error) {
      console.error('Error fetching leads:', error)
      showSnackbar('Error fetching leads', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewLead = (lead) => {
    setDetailDialog({ open: true, lead })
  }

  const handleCloseDialog = () => {
    setDetailDialog({ open: false, lead: null })
  }

  const handleStatusUpdate = () => {
    fetchLeads()
    showSnackbar('Lead status updated successfully', 'success')
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'primary'
      case 'contacted':
        return 'info'
      case 'converted':
        return 'success'
      case 'closed':
        return 'default'
      default:
        return 'default'
    }
  }

  const filteredLeads = leads.filter((lead) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      lead.name?.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.phone?.toLowerCase().includes(searchLower) ||
      lead.city?.toLowerCase().includes(searchLower) ||
      lead.eventType?.toLowerCase().includes(searchLower)
    )
  })

  const statusCounts = {
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    closed: leads.filter((l) => l.status === 'closed').length,
  }

  if (loading && leads.length === 0) {
    return (
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={60} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4">Property Requests (Leads)</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage user property requests from the lead form
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Leads
              </Typography>
              <Typography variant="h4">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                New
              </Typography>
              <Typography variant="h4">{statusCounts.new}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Contacted
              </Typography>
              <Typography variant="h4">{statusCounts.contacted}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Converted
              </Typography>
              <Typography variant="h4">{statusCounts.converted}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name, email, phone, city, or event type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Leads Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Event Details</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 3 }}>
                      {loading ? 'Loading...' : 'No leads found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{lead.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{lead.email}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {lead.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{lead.eventType}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {format(new Date(lead.eventDate), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>{lead.city}</TableCell>
                    <TableCell>{lead.guestCount}</TableCell>
                    <TableCell>{lead.budgetRange}</TableCell>
                    <TableCell>
                      <Chip label={lead.status} color={getStatusColor(lead.status)} size="small" />
                    </TableCell>
                    <TableCell>{format(new Date(lead.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleViewLead(lead)} color="primary">
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Lead Detail Dialog */}
      <LeadDetailDialog
        open={detailDialog.open}
        onClose={handleCloseDialog}
        lead={detailDialog.lead}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LeadsPage
