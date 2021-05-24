import { Button, CircularProgress } from '@material-ui/core';
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import React from 'react';

export const sendingButton = (
  sending: boolean,
  text: string,
  options?: {
    someError?: Error;
    onClick?: () => void;
    startIcon?: JSX.Element;
    componentDiv?: boolean;
  }
): JSX.Element => {
  const startIcon = options?.startIcon ?? <AddTwoToneIcon />;
  return (
    <Button
      variant="outlined"
      color="primary"
      component={options?.componentDiv ? 'div' : 'button'}
      startIcon={sending ? <CircularProgress size={20} /> : startIcon}
      onClick={() => {
        options?.onClick?.();
      }}
      disabled={sending || !!options?.someError}
      type="submit"
    >
      {sending ? 'Enviando' : text}
    </Button>
  );
};
