import { useMutation } from '@apollo/client';
import { Grid, Paper, Snackbar, TextField } from '@material-ui/core';
import React, { ChangeEvent, useState } from 'react';

import { IRecipe, RecipeWrapperChildProps } from '../../types';
import { EditRecipeVars, EDIT_RECIPE } from '../../app.gql';
import { Alert } from '@material-ui/lab';
import { sendingButton } from '../../components/SendingButton';

const useFormFields = <T,>(initialValues: T) => {
  const [formFields, setFormFields] = useState<T>(initialValues);
  const createChangeHandler = (key: keyof T) => (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
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
    <Grid container direction="column" justify="space-around" spacing={3}>
      <Grid item style={{ textAlign: 'center' }}>
        <h1>{data.name}</h1>
        <Paper>
          <TextField
            label="Descripción"
            multiline
            rows={4}
            variant="outlined"
            value={formFields.description || ''}
            onChange={createChangeHandler('description')}
          />
        </Paper>
        {sendingButton(sending, 'Guardar', someError, () => {
          editRecipe({
            variables: {
              id: formFields.id,
              description: formFields.description || '',
            },
          });
        })}
        {someError && (
          <Snackbar open={!!someError} onClose={() => setSomeError(undefined)}>
            <Alert onClose={() => setSomeError(undefined)} severity="error">
              {someError.message}
            </Alert>
          </Snackbar>
        )}
        <Snackbar open={success} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success">
            Receta actualizada satisfactoriamente
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default EditRecipe;
