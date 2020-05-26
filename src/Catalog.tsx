import { Alert, AlertTitle } from '@material-ui/lab';
import { useQuery, useMutation } from '@apollo/react-hooks';
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React, { useState, useRef } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';

import { GET_RECIPES, ADD_RECIPE } from './catalog.gql';
import RecipeRow from './RecipeRow';
import { IRecipe } from './types';

interface IRecipeForm {
  recipeName: { value: string };
}

function Catalog() {
  const recipeForm = useRef(null);
  const [recipes, setRecipes] = useState(Array<IRecipe>());
  const [someError, setSomeError] = useState(null as Error | null);
  const { loading: loadingRecipes } = useQuery(GET_RECIPES, {
    onCompleted: (data) => {
      setRecipes(data.getRecipes);
    },
    onError: (error) => {
      setSomeError(error);
    },
  });
  const [addRecipe, { loading: sending }] = useMutation(ADD_RECIPE, {
    onCompleted: ({ addRecipe }) => {
      setRecipes((prevState) => [...prevState, addRecipe]);
    },
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
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes.map((recipe) => (
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
