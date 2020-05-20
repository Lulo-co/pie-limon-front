import { Alert, AlertTitle } from '@material-ui/lab';
import { useQuery, useMutation } from '@apollo/react-hooks';
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React, { useState, useRef } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';

import { GET_RECIPES, ADD_RECIPE } from './catalog.gql';

interface IRecipeForm {
  recipeName: { value: string };
}

interface IRecipe {
  id: number;
  name: string;
}

function Catalog() {
  const recipeForm = useRef(null);
  const [recipes, setRecipes] = useState(Array<IRecipe>());
  const { loading: loadingRecipes, error: recipesError } = useQuery(
    GET_RECIPES,
    {
      onCompleted: (data) => {
        setRecipes(data.getRecipes);
      },
    }
  );
  const [addRecipe, { loading: sending, error: addError }] = useMutation(
    ADD_RECIPE,
    {
      onCompleted: ({ addRecipe }) => {
        setRecipes((prevState) => [...prevState, addRecipe]);
      },
    }
  );
  // const [uploadFile, { loading: sendingFile }] = useMutation(
  //   UPLOAD_FILE,
  //   {
  //     onCompleted: () => {}
  //   }
  // );

  const errorMessages = [
    recipesError as Error,
    addError as Error,
    // uploadError as Error,
  ]
    .filter(Boolean)
    .map((err) => <p key={err.name}>{err.message}</p>);

  const onRecipeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(64);
    event.preventDefault();
    const form = recipeForm.current! as IRecipeForm;
    const name = form.recipeName.value;
    addRecipe({ variables: { name } });
    form.recipeName.value = '';
  };

  return (
    <Grid container direction="column" justify="space-around" spacing={3}>
      {/* <form
        onSubmit={() => {
          console.log("Submitted");
        }}
        encType={"multipart/form-data"}
      >
        <input
          name={"document"}
          type={"file"}
          onChange={({ target: { files } }) => {
            const file = files![0];
            console.log(file);
            file && uploadFile({ variables: { file: file } });
          }}
        />
        {sendingFile && <p>Loading.....</p>}
      </form> */}
      <Grid item>
        <form ref={recipeForm} onSubmit={onRecipeSubmit}>
          <Paper style={{ paddingTop: 12 }}>
            <Grid container alignItems="center" justify="center" spacing={3}>
              <Grid item>
                <TextField required name="recipeName" label="Nombre receta" />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<AddTwoToneIcon />}
                  disabled={sending || !!addError}
                  type="submit"
                >
                  {sending ? '...' : 'Agregar'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Grid>

      <Grid item>
        {loadingRecipes && (
          <Alert severity="info" style={{ margin: 'auto', width: '33%' }}>
            Cargando Recetas ...
          </Alert>
        )}
        {errorMessages.length > 0 && (
          <Alert severity="error" style={{ margin: 'auto', width: '50%' }}>
            <AlertTitle>Error</AlertTitle>
            {errorMessages}
          </Alert>
        )}
      </Grid>

      <Grid item>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes.map(({ id, name }) => (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {name}
                  </TableCell>
                  <TableCell align="right">+ (._. )</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default Catalog;
