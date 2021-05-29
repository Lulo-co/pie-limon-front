import { useMutation } from '@apollo/client';
import {
  CircularProgress,
  Grid,
  GridListTile,
  GridListTileBar,
  IconButton,
  makeStyles,
  Paper,
  TextField,
} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { IRecipe } from '../../types';
import { EditRecipeVars, EDIT_RECIPE } from '../../app.gql';
import { sendingButton } from '../../components/SendingButton';
import useTransition from '../../hooks/useTransition';
import { Pagination } from '@material-ui/lab';
import RecipePhoto from '../../components/RecipePhoto';
import useAddPhoto from '../../hooks/useAddPhoto';
import { RecipeWrapperChildProps } from '../../components/RecipeWrapper';
import useDeletePhoto from '../../hooks/useDeletePhoto';

const useFormFields = <T,>(initialValues: T) => {
  const [formFields, setFormFields] = useState<T>(initialValues);
  const createChangeHandler =
    (key: keyof T) =>
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormFields((prev: T) => ({ ...prev, [key]: value }));
    };
  return { formFields, createChangeHandler };
};

interface EditRecipeData {
  addRecipe: IRecipe;
}

const paginationStyles = makeStyles(() => ({
  ul: {
    justifyContent: 'center',
  },
}));

const iconStyles = makeStyles(() => ({
  icon: {
    color: 'white',
  },
}));

const EditRecipe: React.FC<RecipeWrapperChildProps> = (props) => {
  const { data, refetch } = props;
  const { formFields, createChangeHandler } = useFormFields<IRecipe>(data);
  const [success, setSuccess] = useState(false);
  const [someError, setSomeError] = useState<Error>();
  const [currentPhotoIndex, setcurrentPhotoIndex] = useState(0);
  const [alertDisplayed, setAlertDisplayed] = useState('');

  const {
    someError: errorAddPhoto,
    uploadFile,
    loading: sendingPhoto,
    success: successAddPhoto,
  } = useAddPhoto();
  const {
    error: errorDeletePhoto,
    deletePhoto,
    loading: deletingPhoto,
    success: successDeletePhoto,
  } = useDeletePhoto();

  useEffect(() => {
    if (successAddPhoto || successDeletePhoto) refetch();
  }, [successAddPhoto, successDeletePhoto]);

  useEffect(() => {
    if (successAddPhoto || errorAddPhoto) setAlertDisplayed('addPhoto');
  }, [successAddPhoto, errorAddPhoto]);
  useEffect(() => {
    if (successDeletePhoto || errorDeletePhoto)
      setAlertDisplayed('deletePhoto');
  }, [successDeletePhoto, errorDeletePhoto]);
  useEffect(() => {
    if (successAddPhoto) setcurrentPhotoIndex(data.photos.length);
  }, [successAddPhoto]);
  useEffect(() => {
    if (currentPhotoIndex >= data.photos.length) {
      setcurrentPhotoIndex(data.photos.length - 1);
    }
  }, [data.photos.length]);
  const paginationClasses = paginationStyles();
  const iconClasses = iconStyles();

  const [editRecipe, { loading: sending }] = useMutation<
    EditRecipeData,
    EditRecipeVars
  >(EDIT_RECIPE, {
    onCompleted: () => setSuccess(true),
    onError: (error) => {
      setSomeError(error);
    },
  });

  return (
    <>
      <Grid container direction="column" justify="space-around" spacing={3}>
        <Grid item style={{ textAlign: 'center' }}>
          <h1>{data.name}</h1>
        </Grid>
      </Grid>
      <Paper style={{ padding: 15, marginBottom: 15 }}>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              multiline
              rows={10}
              variant="outlined"
              style={{ width: '85%' }}
              value={formFields.description || ''}
              onChange={createChangeHandler('description')}
            />
          </Grid>
          <Grid item xs={2} style={{ paddingTop: 15, paddingBottom: 15 }}>
            {sendingButton(sending, 'Guardar', {
              someError,
              startIcon: <SaveAltIcon />,
              onClick: () => {
                editRecipe({
                  variables: {
                    id: formFields.id,
                    description: formFields.description || '',
                  },
                });
              },
            })}
          </Grid>
          <Grid item xs={8}>
            {useTransition(!!someError, 'error', someError?.message || '', {
              duration: 5000,
              onClose: () => {
                setSomeError(undefined);
              },
              styles: { display: someError ? 'flex' : 'none' },
            })}
            {useTransition(
              success,
              'success',
              'Receta actualizada satisfactoriamente',
              {
                duration: 5000,
                onClose: () => {
                  setSuccess(false);
                },
                styles: { display: success ? 'flex' : 'none' },
              }
            )}
          </Grid>
        </Grid>
      </Paper>
      <Paper style={{ padding: 15 }}>
        <Grid container direction="row" justify="space-between" spacing={3}>
          <Grid item xs={6}>
            <h2 style={{ margin: 0 }}>Fotos de la receta</h2>
          </Grid>
          <Grid item xs={4} style={{ textAlign: 'right' }}>
            {useTransition(
              !!errorAddPhoto && alertDisplayed == 'addPhoto',
              'error',
              errorAddPhoto?.message || 'Error agregando foto',
              {
                duration: 3000,
                styles: {
                  display:
                    errorAddPhoto && alertDisplayed == 'addPhoto'
                      ? 'flex'
                      : 'none',
                },
                onClose: () => {
                  setAlertDisplayed('');
                },
                showClose: false,
              }
            )}
            {useTransition(
              successAddPhoto && alertDisplayed == 'addPhoto',
              'success',
              'Foto agregada satisfactoriamente',
              {
                duration: 3000,
                styles: {
                  display:
                    successAddPhoto && alertDisplayed == 'addPhoto'
                      ? 'flex'
                      : 'none',
                },
                onClose: () => {
                  setAlertDisplayed('');
                },
                showClose: false,
              }
            )}
            {useTransition(
              !!errorDeletePhoto && alertDisplayed == 'deletePhoto',
              'error',
              errorDeletePhoto?.message || 'Error eliminando foto',
              {
                duration: 3000,
                styles: {
                  display:
                    errorDeletePhoto && alertDisplayed == 'deletePhoto'
                      ? 'flex'
                      : 'none',
                },
                onClose: () => {
                  setAlertDisplayed('');
                },
                showClose: false,
              }
            )}
            {useTransition(
              successDeletePhoto && alertDisplayed == 'deletePhoto',
              'success',
              'Foto eliminada satisfactoriamente',
              {
                duration: 3000,
                styles: {
                  display:
                    successDeletePhoto && alertDisplayed == 'deletePhoto'
                      ? 'flex'
                      : 'none',
                },
                onClose: () => {
                  setAlertDisplayed('');
                },
                showClose: false,
              }
            )}
          </Grid>
          <Grid
            item
            xs={2}
            style={{ textAlign: 'right', paddingBottom: 20, paddingTop: 20 }}
          >
            <input
              accept="image/*"
              type="file"
              style={{ display: 'none' }}
              id={`add-photo`}
              onChange={({ target: { files } }) => {
                if (files?.[0]) {
                  uploadFile(files[0], data.id);
                }
              }}
              disabled={sendingPhoto || !!errorAddPhoto}
            />
            <label htmlFor={`add-photo`}>
              {sendingButton(sendingPhoto, 'Agregar Foto', {
                startIcon: <AddPhotoAlternateIcon />,
                componentDiv: true,
              })}
            </label>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-around" spacing={3}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            {data.photos.length > 0 ? (
              <Pagination
                count={data.photos.length}
                color="primary"
                classes={paginationClasses}
                page={currentPhotoIndex + 1}
                onChange={(e, v) => {
                  setcurrentPhotoIndex(v - 1);
                }}
              />
            ) : (
              <h4>La receta no tiene fotos aún </h4>
            )}
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'center' }}>
            {data.photos.map(({ url }, index) => {
              return (
                <GridListTile component="div" key={index}>
                  <RecipePhoto
                    url={url}
                    visible={index === currentPhotoIndex}
                  />
                  {index === currentPhotoIndex && (
                    <GridListTileBar
                      titlePosition="top"
                      actionIcon={
                        <IconButton
                          className={iconClasses.icon}
                          title="Eliminar foto"
                          onClick={() => {
                            deletePhoto(url);
                          }}
                          disabled={deletingPhoto}
                        >
                          {deletingPhoto ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DeleteForeverIcon />
                          )}
                        </IconButton>
                      }
                    />
                  )}
                </GridListTile>
              );
            })}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default EditRecipe;
