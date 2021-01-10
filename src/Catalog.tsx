import { Alert, AlertTitle } from '@material-ui/lab';
import { useLazyQuery, useMutation } from '@apollo/client';
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
} from '@material-ui/core';

import { GET_RECIPES, ADD_RECIPE, AddRecipeVars } from './catalog.gql';
import RecipeRow from './RecipeRow';
import { IRecipe } from './types';

interface IRecipeForm {
  recipeName: { value: string };
}

interface GetRecipesData {
  getRecipes: IRecipe[];
}

interface AddRecipeData {
  addRecipe: IRecipe;
}

function Catalog() {
  const recipeForm = useRef(null);
  const [someError, setSomeError] = useState(null as Error | null);
  const [
    getRecipesQuery,
    { loading: loadingRecipes, refetch: recipesRefetch, data },
  ] = useLazyQuery<GetRecipesData>(GET_RECIPES, {
    onError: (error) => {
      setSomeError(error);
    },
  });

  useEffect(() => {
    getRecipesQuery();
  }, [getRecipesQuery]);

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
    <Grid container direction="column" justify="space-around" spacing={3}>
      <Grid item>
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
      </Grid>

      <Grid item>
        {loadingRecipes && (
          <Alert severity="info" style={{ margin: 'auto', width: '33%' }}>
            Cargando Recetas ...
          </Alert>
        )}
        {someError && (
          <Alert severity="error" style={{ margin: 'auto', width: '50%' }}>
            <AlertTitle>Error</AlertTitle>
            <p>{someError.message}</p>
          </Alert>
        )}
      </Grid>

      <Grid item>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} style={{ width: '85%' }}>
                  Nombre
                </TableCell>
                <TableCell align="right" style={{ width: '5%' }}>
                  <IconButton
                    title="Fotos por receta"
                    size="small"
                    style={{
                      backgroundColor: 'transparent',
                      cursor: 'default',
                    }}
                  >
                    <PhotoLibraryIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="right" style={{ width: '10%' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.getRecipes.map((recipe) => (
                  <RecipeRow recipe={recipe} key={recipe.id} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default Catalog;
