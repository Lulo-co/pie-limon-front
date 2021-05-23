import { Alert, AlertTitle } from '@material-ui/lab';
import { useLazyQuery } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect } from 'react';

import { GET_RECIPES } from '../../app.gql';
import { IRecipe } from '../../types';
import AddRecipeForm from './AddRecipeForm';
import RecipeList from './RecipeList';

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

  const recipes = data?.getRecipes || [];

  return (
    <Grid container direction="column" justify="space-around" spacing={3}>
      <Grid item>
        <AddRecipeForm
          recipesRefetch={() => {
            recipesRefetch?.();
          }}
          setSomeError={(e) => setSomeError(e)}
          someError={someError}
          recipes={recipes}
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
        <RecipeList recipes={recipes} />
      </Grid>
    </Grid>
  );
}

export default Catalog;
