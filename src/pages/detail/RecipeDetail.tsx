import { Grid, Paper, ButtonGroup, Button } from '@material-ui/core';
import React, { useState } from 'react';

import { RecipeWrapperChildProps } from '../../types';
import RecipePhoto from './RecipePhoto';

interface RouteParams {
  id: string;
}

const RecipeDetail: React.FC<RecipeWrapperChildProps> = (props) => {
  const { data } = props;
  const [currentPhotoIndex, setcurrentPhotoIndex] = useState(0);

  return (
    <Grid container direction="column" justify="space-around" spacing={3}>
      <Grid item style={{ textAlign: 'center' }}>
        <Paper>
          <h1>{data.name}</h1>
          {data.photos.length === 0 && (
            <h5>La receta no tiene fotos aún </h5>
          )}
          <ButtonGroup variant="outlined" color="primary">
            {data.photos.map((_v, index) => (
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
        {data.photos.map(({ url }, index) => {
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
