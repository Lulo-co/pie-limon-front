import { Grid, Paper, makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { useState } from 'react';

import RecipePhoto from '../../components/RecipePhoto';
import { RecipeWrapperChildProps } from '../../components/RecipeWrapper';

const pagStyles = makeStyles(() => ({
  ul: {
    justifyContent: 'center',
  },
}));

const RecipeDetail: React.FC<RecipeWrapperChildProps> = (props) => {
  const { data } = props;
  const [currentPhotoIndex, setcurrentPhotoIndex] = useState(0);
  const classes = pagStyles();

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
          <Grid item xs={10}>
            <Paper elevation={0} variant="outlined" style={{ padding: 15 }}>
              <h4 style={{ marginTop: 0 }}>Descripción</h4>
              {data.description}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Pagination
              count={data.photos.length}
              color="primary"
              classes={classes}
              onChange={(e, v) => {
                setcurrentPhotoIndex(v - 1);
              }}
            />
          </Grid>
          <Grid item xs={10} style={{ textAlign: 'center' }}>
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
