import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { GET_RECIPE, GetRecipeVars } from './catalog.gql';
import { Grid, Paper, ButtonGroup, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

interface GetRecipeData {
  getRecipe: {
    id: number;
    name: string;
    photos: Array<{ url: string }>;
  };
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams();
  const [currentPhotoIndex, setcurrentPhotoIndex] = useState(0);
  const { loading, data, error } = useQuery<GetRecipeData, GetRecipeVars>(
    GET_RECIPE,
    {
      variables: { recipeId: id },
      errorPolicy: 'all',
    }
  );

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

  if (loading) {
    return (
      <Grid item>
        <Alert severity="info" style={{ margin: 'auto', width: '33%' }}>
          Cargando Receta ...
        </Alert>
      </Grid>
    );
  }
  console.log('RENDER!');
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
        <img
          style={{ maxWidth: '100%' }}
          src={data!.getRecipe.photos[currentPhotoIndex].url}
          alt="Foto de receta"
        />
      </Grid>
    </Grid>
  );
};

export default RecipeDetail;
