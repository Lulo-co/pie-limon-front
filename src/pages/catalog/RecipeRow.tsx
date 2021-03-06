import { Color } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
} from '@material-ui/core';

import { IRecipe } from '../../types';

import { viewRecipe, editRecipe } from '../../Routes';
import useTransition from '../../hooks/useTransition';
import useAddPhoto from '../../hooks/useAddPhoto';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import useDeleteRecipe from '../../hooks/useDeleteRecipe';

interface RecipeRowProps {
  recipe: IRecipe;
}

let alertType: undefined | string = undefined;
let alertMessage = 'Foto subida correctamente :)';

const RecipeRow: React.FC<RecipeRowProps> = ({ recipe }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [numPhotos, setNumPhotos] = useState(recipe.num_photos);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { someError, uploadFile, loading: uploading, success } = useAddPhoto();
  const {
    error: errorDeleteRecipe,
    deleteRecipe,
    loading: sendingDeleteRecipe,
    success: successDeleteRecipe,
  } = useDeleteRecipe();

  useEffect(() => {
    if (success) {
      setFileUploaded(success);
      setNumPhotos(numPhotos + 1);
    }
  }, [success]);

  let alertDisplay = false;

  if (fileUploaded) {
    alertDisplay = true;
    alertType = 'success';
    alertMessage = 'Foto subida correctamente :)';
  } else if (someError) {
    alertDisplay = true;
    alertType = 'error';
    alertMessage = 'No se pudo subir la foto';
  } else if (errorDeleteRecipe) {
    alertDisplay = true;
    alertType = 'error';
    alertMessage = errorDeleteRecipe.message || 'Error eliminiando la receta';
  }

  const { name, id } = recipe;
  const transition = useTransition(
    alertDisplay,
    alertType as Color,
    alertMessage,
    {
      styles: { padding: '0 11px' },
      duration: 4000,
    }
  );
  if (successDeleteRecipe) return <></>;

  return (
    <TableRow>
      <TableCell>
        <Link to={`${viewRecipe(id)}`}>{name}</Link>
      </TableCell>
      <TableCell align="right">{transition}</TableCell>
      <TableCell align="right" size="small">
        {numPhotos}
      </TableCell>
      <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>
        <input
          accept="image/*"
          type="file"
          style={{ display: 'none' }}
          id={`add-photo-${id}`}
          onChange={({ target: { files } }) => {
            if (files?.[0]) {
              uploadFile(files[0], id);
            }
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
        <Link to={`${editRecipe(id)}`}>
          <IconButton title="Editar receta" size="small">
            <EditIcon />
          </IconButton>
        </Link>
        <Link to={`${viewRecipe(id)}`}>
          <IconButton title="Ver receta" size="small">
            <VisibilityIcon />
          </IconButton>
        </Link>
        <IconButton
          title="Eliminar receta"
          size="small"
          onClick={() => {
            setOpenDeleteDialog(true);
          }}
        >
          {sendingDeleteRecipe ? (
            <CircularProgress size={20} />
          ) : (
            <DeleteForeverIcon />
          )}
        </IconButton>
        <ConfirmationDialog
          open={openDeleteDialog}
          description="Se eliminarán todos los datos y fotos"
          title="¿Seguro que desea eliminar la receta?"
          setOpen={setOpenDeleteDialog}
          onConfirm={() => {
            deleteRecipe(id);
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default RecipeRow;
