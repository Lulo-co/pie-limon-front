import { Alert, AlertTitle } from '@material-ui/lab';
import { useLazyQuery } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@material-ui/core';

import { GET_RECIPES } from './catalog.gql';
import RecipeRow from './RecipeRow';
import { IRecipe } from './types';
import AddRecipeForm from './AddRecipeForm';

interface GetRecipesData {
  getRecipes: IRecipe[];
}
 

function Catalog() {
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

  return (
    <Grid container direction="column" justify="space-around" spacing={3}>
      <Grid item>
        <AddRecipeForm
          recipesRefetch={() => {
            recipesRefetch?.();
          }}
          setSomeError={(e) => setSomeError(e)}
          someError={someError}
        />
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
