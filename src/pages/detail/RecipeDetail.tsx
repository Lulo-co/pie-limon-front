import {
  Grid,
  Paper,
  ButtonGroup,
  Button,
  makeStyles,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { useState } from 'react';

import { RecipeWrapperChildProps } from '../../types';
import RecipePhoto from './RecipePhoto';

const useStyles = makeStyles((theme) => ({
  ul: {
    justifyContent: 'center',
  },
}));

const RecipeDetail: React.FC<RecipeWrapperChildProps> = (props) => {
  const { data } = props;
  const [currentPhotoIndex, setcurrentPhotoIndex] = useState(0);
  const classes = useStyles();

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container direction="column" justify="space-around" spacing={3}>
        <Grid item style={{ textAlign: 'center' }}>
          <h1>{data.name}</h1>
          {data.photos.length === 0 && <h5>La receta no tiene fotos aún </h5>}
        </Grid>
      </Grid>

      <Paper>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={6}>
            <Pagination
              count={data.photos.length}
              color="primary"
              classes={classes}
              onChange={(e, v) => {
                setcurrentPhotoIndex(v - 1);
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
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
      </Paper>
    </div>
  );
};

export default RecipeDetail;
