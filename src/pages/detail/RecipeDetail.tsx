import { Grid, Paper, ButtonGroup, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React, { useState } from 'react';

import { IRecipe } from '../../types';
import RecipePhoto from './RecipePhoto';
import useGetRecipe from '../../hooks/useGetRecipe';

interface GetRecipeData {
  getRecipe: IRecipe;
}

interface RouteParams {
  id: string;
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [currentPhotoIndex, setcurrentPhotoIndex] = useState(0);
  const { loading, data, error } = useGetRecipe(id);

  if (error) return error;
  if (loading) return loading;

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
