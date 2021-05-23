import { Button, CircularProgress } from '@material-ui/core';
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import React from 'react';

export const sendingButton = (
  sending: boolean,
  text: string,
  someError?: Error | undefined,
  onClick?: () => void
): JSX.Element => (
  <Button
    variant="outlined"
    color="primary"
    startIcon={sending ? <CircularProgress size={20} /> : <AddTwoToneIcon />}
    onClick={() => {
      onClick?.();
    }}
    disabled={sending || !!someError}
    type="submit"
  >
    {sending ? 'Enviando' : text}
  </Button>
);
