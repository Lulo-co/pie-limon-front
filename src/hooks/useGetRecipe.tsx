import { Alert, AlertTitle } from '@material-ui/lab';
import { Grid } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';

import { GET_RECIPE, GetRecipeVars } from '../app.gql';
import { IRecipe } from '../types';

interface GetRecipeData {
  getRecipe: IRecipe;
}

export const useGetRecipe = (recipeId: string) => {
  const [queryGetRecipe, { loading, data, error }] = useLazyQuery<
    GetRecipeData,
    GetRecipeVars
  >(GET_RECIPE, {
    variables: { recipeId },
    errorPolicy: 'all',
  });
  useEffect(() => {
    queryGetRecipe();
  }, [queryGetRecipe]);

  let errorJsx = null;
  if (error) {
    errorJsx = (
      <Grid item>
        <Alert severity="error" style={{ margin: 'auto', width: '50%' }}>
          <AlertTitle>Error</AlertTitle>
          <p>{error.message}</p>
        </Alert>
      </Grid>
    );
  }

  let loadingJsx = null;
  if (loading || !data) {
    loadingJsx = (
      <Grid item>
        <Alert severity="info" style={{ margin: 'auto', width: '33%' }}>
          Cargando Receta ...
        </Alert>
      </Grid>
    );
  }

  return { loading: loadingJsx, data, error: errorJsx };
}
export default useGetRecipe;
