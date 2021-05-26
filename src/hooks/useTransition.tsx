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

interface SharedOptions {
  styles?: React.CSSProperties;
}

interface DurationOptions extends SharedOptions {
  duration: number;
}

interface OnCloseOptions extends SharedOptions {
  onClose: () => void;
}

type AllOptions = DurationOptions & OnCloseOptions;

type options = DurationOptions | OnCloseOptions | AllOptions;

const isDurationOptions = (options: options): options is DurationOptions => {
  return (
    (options as DurationOptions).duration !== undefined &&
    (options as OnCloseOptions).onClose === undefined
  );
};

const isOnCloseOptions = (options: options): options is OnCloseOptions => {
  return (
    (options as OnCloseOptions).onClose !== undefined &&
    (options as DurationOptions).duration === undefined
  );
};

const isAllOptions = (options: options): options is AllOptions => {
  return (
    (options as OnCloseOptions).onClose !== undefined &&
    (options as DurationOptions).duration !== undefined
  );
};

const useTransition = (
  show: boolean,
  severity: Color,
  message: string,
  options: options
): JSX.Element => {
  const id = useRef<number>(0);
  const [visible, setVisible] = useState(false);
  const alertRef = useRef(null);

  useEffect(() => {
    if (show) {
      setVisible(true);
      if (!isOnCloseOptions(options)) {
        id.current = setTimeout(() => {
          setVisible(false);
        }, options.duration);
        return () => clearTimeout(id.current);
      }
    }
  }, [show]);

  return (
    <Transition nodeRef={alertRef} in={visible} timeout={1500}>
      {(state: keyof typeof transitionStyles) => {
        return (
          <Alert
            severity={severity}
            style={{
              ...options.styles,
              ...defaultStyle,
              ...transitionStyles[state],
            }}
            onClose={
              isDurationOptions(options)
                ? undefined
                : () => {
                    setVisible(false);
                    options.onClose();
                    if (isAllOptions(options)) {
                      clearTimeout(id.current);
                    }
                  }
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
