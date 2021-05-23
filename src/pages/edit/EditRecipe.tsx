import { Grid, Paper } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React from 'react';

import useGetRecipe from '../../hooks/useGetRecipe';

interface RouteParams {
  id: string;
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const { loading, data, error } = useGetRecipe(id);

  if (error) return error;
  if (loading) return loading;

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
