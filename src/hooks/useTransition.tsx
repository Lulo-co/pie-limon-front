import { Alert, Color } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';

const defaultStyle = {
  transition: `opacity 1500ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 1 },
  exited: { opacity: 0 },
};

interface UseTransitionOptions {
  styles?: any;
  duration?: number;
  showClose?: boolean;
}

const useTransition = (
  show: boolean,
  severity: Color,
  message: string,
  onClose: () => void,
  { styles, duration, showClose }: UseTransitionOptions
) => {
  let id: number;
  useEffect(() => {
    if (show) {
      id = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(id);
    }
  }, [show]);
  const alertRef = useRef(null);
  return (
    <Transition nodeRef={alertRef} in={show} timeout={1500}>
      {(state: keyof typeof transitionStyles) => {
        return (
          <Alert
            severity={severity}
            style={{
              ...styles,
              ...defaultStyle,
              ...transitionStyles[state],
            }}
            onClose={
              showClose
                ? () => {
                    onClose();
                    clearTimeout(id);
                  }
                : undefined
            }
          >
            {message}
          </Alert>
        );
      }}
    </Transition>
  );
};

export default useTransition;
