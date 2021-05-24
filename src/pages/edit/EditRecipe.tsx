import { useMutation } from '@apollo/client';
import { Grid, Paper, TextField } from '@material-ui/core';
import React, { ChangeEvent, useState } from 'react';

import { IRecipe, RecipeWrapperChildProps } from '../../types';
import { EditRecipeVars, EDIT_RECIPE } from '../../app.gql';
import { sendingButton } from '../../components/SendingButton';
import useTransition from '../../hooks/useTransition';

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

const EditRecipe: React.FC<RecipeWrapperChildProps> = (props) => {
  const { data } = props;
  const { formFields, createChangeHandler } = useFormFields<IRecipe>(data);
  const [success, setSuccess] = useState(false);
  const [someError, setSomeError] = useState<Error>();

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
            {sendingButton(sending, 'Guardar', someError, () => {
              editRecipe({
                variables: {
                  id: formFields.id,
                  description: formFields.description || '',
                },
              });
            })}
          </Grid>
          <Grid item xs={8}>
            {useTransition(
              !!someError,
              'error',
              someError?.message || '',
              () => setSomeError(undefined),
              {
                duration: 5000,
                showClose: true,
                styles: { display: !!someError ? 'flex' : 'none' },
              }
            )}
            {useTransition(
              success,
              'success',
              'Receta actualizada satisfactoriamente',
              () => {
                setSuccess(false);
              },
              {
                duration: 5000,
                showClose: true,
                styles: { display: success ? 'flex' : 'none' },
              }
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper style={{ padding: 15 }}>
        <Grid container direction="row" justify="space-between" spacing={3}>
          <Grid item>
            <h2 style={{ margin: 0 }}>Fotos de la receta</h2>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-around" spacing={3}>
          <Grid item xs={7}></Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default EditRecipe;
