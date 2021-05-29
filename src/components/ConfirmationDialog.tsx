import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

interface ConfirmationDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
  const { open, setOpen, title, description, onConfirm } = props;
  return (
    <Dialog
      fullWidth
      onClose={() => setOpen(false)}
      aria-labelledby="names-modal-title"
      aria-describedby="names-modal-desc"
      open={open}
    >
      <DialogTitle
        disableTypography
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Typography variant="h6" id="names-modal-title">
          {title}
        </Typography>
        <IconButton aria-label="close" onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom id="names-modal-desc">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
