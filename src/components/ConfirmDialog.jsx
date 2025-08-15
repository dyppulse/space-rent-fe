import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'

export default function ConfirmDialog({
  open,
  title,
  content,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      {content ? (
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        </DialogContent>
      ) : null}
      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button variant="contained" color="primary" onClick={onConfirm} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
