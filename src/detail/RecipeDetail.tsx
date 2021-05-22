import { Alert, AlertTitle } from '@material-ui/lab';
import { Grid, Paper, ButtonGroup, Button } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { GET_RECIPE, GetRecipeVars } from '../app.gql';
import { IRecipe } from '../types';
import RecipePhoto from './RecipePhoto';

interface GetRecipeData {
  getRecipe: IRecipe;
}

interface RouteParams {
  id: string;
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [currentPhotoIndex, setcurrentPhotoIndex] = useState(0);
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
          {data!.getRecipe.photos.length === 0 && (
            <h5>La receta no tiene fotos aún </h5>
          )}
          <ButtonGroup variant="outlined" color="primary">
            {data!.getRecipe.photos.map((_v, index) => (
              <Button
                variant={index === currentPhotoIndex ? 'contained' : 'outlined'}
                key={index}
                onClick={() => {
                  setcurrentPhotoIndex(index);
                }}
              >
                {index + 1}
              </Button>
            ))}
          </ButtonGroup>
        </Paper>
      </Grid>

      <Grid item style={{ textAlign: 'center', maxWidth: '100%' }}>
        {data!.getRecipe.photos.map(({ url }, index) => {
          return (
            <RecipePhoto
              key={index}
              url={url}
              visible={index === currentPhotoIndex}
            />
          );
        })}
      </Grid>
    </Grid>
  );
};

export default RecipeDetail;
