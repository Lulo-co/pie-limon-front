import { Alert, AlertTitle } from '@material-ui/lab';
import { Grid, Paper } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

import { GET_RECIPE, GetRecipeVars } from '../app.gql';
import { IRecipe } from '../types';

interface GetRecipeData {
  getRecipe: IRecipe;
}

interface RouteParams {
  id: string;
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const [queryGetRecipe, { loading, data, error }] = useLazyQuery<
    GetRecipeData,
    GetRecipeVars
  >(GET_RECIPE, {
    variables: { recipeId: id },
    errorPolicy: 'all',
  });
  useEffect(() => {
    queryGetRecipe();
  }, [queryGetRecipe]);

  if (error) {
    return (
      <Grid item>
        <Alert severity="error" style={{ margin: 'auto', width: '50%' }}>
          <AlertTitle>Error</AlertTitle>
          <p>{error.message}</p>
        </Alert>
      </Grid>
    );
  }

  if (loading || !data) {
    return (
      <Grid item>
        <Alert severity="info" style={{ margin: 'auto', width: '33%' }}>
          Cargando Receta ...
        </Alert>
      </Grid>
    );
  }

  return (
    <Grid container direction="column" justify="space-around" spacing={3}>
      <Grid item style={{ textAlign: 'center' }}>
        <Paper>
          <h1>{data!.getRecipe.name}</h1>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RecipeDetail;
