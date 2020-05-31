import { Alert, Color } from '@material-ui/lab';
import { Transition } from 'react-transition-group';
import { useMutation } from '@apollo/react-hooks';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import React, { useState } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
} from '@material-ui/core';

import { UPLOAD_PHOTO } from './catalog.gql';
import { IRecipe } from './types';

interface RecipeRowProps {
  recipe: IRecipe;
}

const alertDuration = 4000;
const transitionDuration = 2000;
const defaultStyle = {
  transition: `opacity ${transitionDuration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 1 },
  exited: { opacity: 0 },
};

let alertType: undefined | string = undefined;
let alertMessage = 'Foto subida correctamente :)';

const RecipeRow = ({ recipe }: RecipeRowProps) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [someError, setSomeError] = useState(null as Error | null);
  const [numPhotos, setNumPhotos] = useState(recipe.photos.length);

  const reportError = (error: Error) => {
    setSomeError(error);
    setTimeout(() => {
      setSomeError(null);
    }, alertDuration);
  };

  const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_PHOTO, {
    onCompleted: ({ attachRecipePhoto }) => {
      if (attachRecipePhoto) {
        setFileUploaded(attachRecipePhoto);
        setNumPhotos(numPhotos + 1);
        setTimeout(() => {
          setFileUploaded(false);
        }, alertDuration);
      } else {
        reportError(new Error());
      }
    },
    onError: reportError,
  });

  const alertRef = React.useRef(null);
  let alertDisplay = false;

  if (fileUploaded) {
    alertDisplay = true;
    alertType = 'success';
    alertMessage = 'Foto subida correctamente :)';
  } else if (someError) {
    alertDisplay = true;
    alertType = 'error';
    alertMessage = 'No se pudo subir la foto';
  }

  const { name, id } = recipe;

  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell align="right">
        <Transition
          nodeRef={alertRef}
          in={alertDisplay}
          timeout={transitionDuration}
        >
          {(state: keyof typeof transitionStyles) => {
            return (
              <Alert
                severity={alertType as Color}
                style={{
                  padding: '0 11px',
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
              >
                {alertMessage}
              </Alert>
            );
          }}
        </Transition>
      </TableCell>
      <TableCell align="right">{numPhotos}</TableCell>
      <TableCell align="right">
        <input
          accept="image/*"
          type="file"
          style={{ display: 'none' }}
          id={`add-photo-${id}`}
          onChange={({ target: { files } }) => {
            const file = files![0];
            file && uploadFile({ variables: { file: file, recipeId: id } });
          }}
          disabled={uploading || !!someError}
        />
        <label htmlFor={`add-photo-${id}`}>
          <IconButton
            title="Agregar foto"
            size="small"
            component="span"
            disabled={uploading || !!someError}
          >
            {uploading ? (
              <CircularProgress size={20} />
            ) : (
              <AddPhotoAlternateIcon />
            )}
          </IconButton>
        </label>
        <IconButton title="Ver receta" size="small">
          <VisibilityIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default RecipeRow;
