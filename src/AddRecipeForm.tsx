import { useMutation } from '@apollo/client';
import { Button, Grid, Paper, TextField } from '@material-ui/core';
import React, { useRef } from 'react';
import { AddRecipeVars, ADD_RECIPE } from './catalog.gql';
import { IRecipe } from './types';
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';

interface IRecipeForm {
  recipeName: { value: string };
}

interface AddRecipeData {
  addRecipe: IRecipe;
}

interface AddRecipeFormProps {
  recipesRefetch: () => void;
  setSomeError: (error: Error) => void;
  someError: Error | null;
}

const AddRecipeForm: React.FC<AddRecipeFormProps> = (props) => {
  const { recipesRefetch, setSomeError, someError } = props;
  const recipeForm = useRef(null);

  const [addRecipe, { loading: sending }] = useMutation<
    AddRecipeData,
    AddRecipeVars
  >(ADD_RECIPE, {
    onCompleted: () => recipesRefetch?.(),
    onError: (error) => { 
      setSomeError(error);
    },
  });

  const onRecipeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = recipeForm.current! as IRecipeForm;
    const name = form.recipeName.value;
    addRecipe({ variables: { name } });
    form.recipeName.value = '';
  };

  return (
    <form ref={recipeForm} onSubmit={onRecipeSubmit}>
      <Paper style={{ paddingTop: 12 }}>
        <Grid container alignItems="center" justify="center" spacing={3}>
          <Grid item>
            <TextField required name="recipeName" label="Nombre receta" />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<AddTwoToneIcon />}
              disabled={sending || !!someError}
              type="submit"
            >
              {sending ? '...' : 'Agregar'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default AddRecipeForm;
