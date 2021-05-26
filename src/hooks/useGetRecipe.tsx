import { Alert, AlertTitle } from '@material-ui/lab';
import { Grid } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import React from 'react';

import { GET_RECIPE, GetRecipeVars } from '../app.gql';
import { IRecipe } from '../types';

interface GetRecipeData {
  getRecipe: IRecipe;
}

interface getRecipeResult {
  loading: JSX.Element | null;
  data?: IRecipe;
  error: JSX.Element | null;
  refetch: () => void;
}

const useGetRecipe = (recipeId: string): getRecipeResult => {
  const { loading, data, error, refetch } = useQuery<
    GetRecipeData,
    GetRecipeVars
  >(GET_RECIPE, {
    variables: { recipeId },
    errorPolicy: 'all',
  });

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

  return {
    loading: loadingJsx,
    data: data?.getRecipe,
    error: errorJsx,
    refetch,
  };
};
export default useGetRecipe;
