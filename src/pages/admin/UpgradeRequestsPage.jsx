import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  TextField,
  CircularProgress,
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
import axiosInstance from '../../api/axiosInstance'

const UpgradeRequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [rejectDialog, setRejectDialog] = useState({ open: false, userId: null })
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState(new Set())

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/admin/upgrade-requests/pending')
      setRequests(response.data.users || [])
    } catch (error) {
      console.error('Error fetching upgrade requests:', error)
      showSnackbar(error.response?.data?.message || 'Error fetching upgrade requests', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this upgrade request?')) {
      return
    }

    try {
      setProcessing((prev) => new Set(prev).add(userId))
      await axiosInstance.post(`/admin/upgrade-requests/${userId}/approve`)
      showSnackbar('Upgrade request approved successfully', 'success')
      fetchRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      showSnackbar(error.response?.data?.message || 'Error approving upgrade request', 'error')
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  const handleReject = async () => {
    const { userId } = rejectDialog
    if (!userId) return

    try {
      setProcessing((prev) => new Set(prev).add(userId))
      await axiosInstance.post(`/admin/upgrade-requests/${userId}/reject`, {
        reason: rejectReason || 'Your upgrade request did not meet our requirements.',
      })
      showSnackbar('Upgrade request rejected successfully', 'success')
      setRejectDialog({ open: false, userId: null })
      setRejectReason('')
      fetchRequests()
    } catch (error) {
      console.error('Error rejecting request:', error)
      showSnackbar(error.response?.data?.message || 'Error rejecting upgrade request', 'error')
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  const openRejectDialog = (userId) => {
    setRejectDialog({ open: true, userId })
  }

  const closeRejectDialog = () => {
    setRejectDialog({ open: false, userId: null })
    setRejectReason('')
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  const getDaysSinceSubmission = (submittedAt) => {
    if (!submittedAt) return 'N/A'
    const days = Math.floor((new Date() - new Date(submittedAt)) / (1000 * 60 * 60 * 24))
    return `${days} day${days !== 1 ? 's' : ''}`
  }

  if (loading && requests.length === 0) {
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
          <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4">Upgrade Requests</Typography>
            <Typography variant="body1" color="textSecondary">
              Review and manage client requests to become space owners
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchRequests}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Card */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Requests
              </Typography>
              <Typography variant="h4">{requests.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Requests Table */}
      {requests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <BusinessIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Pending Upgrade Requests
          </Typography>
          <Typography variant="body2" color="textSecondary">
            All upgrade requests have been processed.
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Verification Info</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon color="action" />
                        <Box>
                          <Typography variant="subtitle2">{user.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {user.id.slice(-8)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">{user.email}</Typography>
                        </Box>
                        {user.phone && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{user.phone}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.upgradeRequest?.submittedAt
                          ? format(new Date(user.upgradeRequest.submittedAt), 'MMM dd, yyyy')
                          : 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {getDaysSinceSubmission(user.upgradeRequest?.submittedAt)} ago
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {user.upgradeRequest?.verificationInfo ? (
                        <Box>
                          {user.upgradeRequest.verificationInfo.businessName && (
                            <Typography variant="body2" noWrap>
                              {user.upgradeRequest.verificationInfo.businessName}
                            </Typography>
                          )}
                          {user.upgradeRequest.verificationInfo.propertyAddress && (
                            <Typography variant="caption" color="textSecondary" noWrap>
                              {user.upgradeRequest.verificationInfo.propertyAddress}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No verification info
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={
                            processing.has(user.id) ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                          onClick={() => handleApprove(user.id)}
                          disabled={processing.has(user.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={
                            processing.has(user.id) ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <CancelIcon />
                            )
                          }
                          onClick={() => openRejectDialog(user.id)}
                          disabled={processing.has(user.id)}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={closeRejectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Upgrade Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
            Please provide a reason for rejecting this upgrade request. This will be sent to the
            user via email.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Your upgrade request did not meet our requirements."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectDialog}>Cancel</Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disabled={processing.has(rejectDialog.userId)}
          >
            {processing.has(rejectDialog.userId) ? 'Rejecting...' : 'Reject Request'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default UpgradeRequestsPage
