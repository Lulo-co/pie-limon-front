import { Grid, Paper, TextField } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import * as SS from 'string-similarity';
import React, { useRef, useState } from 'react';

import { AddRecipeVars, ADD_RECIPE } from '../../app.gql';
import { IRecipe } from '../../types';
import { sendingButton } from '../../components/SendingButton';
import SimilarNamesDialog from './SimilarNamesDialog';

interface IRecipeForm {
  recipeName: { value: string };
}

interface AddRecipeData {
  addRecipe: IRecipe;
}

interface AddRecipeFormProps {
  recipesRefetch: () => void;
  setSomeError: (error: Error) => void;
  someError?: Error;
  recipes: IRecipe[];
}

const getSimilarRecipeByName = (
  target: string,
  recipes: IRecipe[]
): IRecipe[] => {
  const THRESHOLD = 0.5;
  const results = SS.findBestMatch(
    target,
    recipes.map((r) => r.name)
  );

  return results.ratings.reduce(
    (results: IRecipe[], ratedRecipe: SS.Rating, curretIndex) =>
      ratedRecipe.rating > THRESHOLD
        ? [...results, recipes[curretIndex]]
        : results,
    []
  );
};

const AddRecipeForm: React.FC<AddRecipeFormProps> = (props) => {
  const { recipesRefetch, setSomeError, someError, recipes } = props;

  const recipeForm = useRef(null);
  const [similarRecipes, setSimilarRecipes] = useState<IRecipe[]>([]);
  const [namesModal, setNamesModal] = useState(false);
  const [addRecipe, { loading: sending }] = useMutation<
    AddRecipeData,
    AddRecipeVars
  >(ADD_RECIPE, {
    onCompleted: () => recipesRefetch?.(),
    onError: (error) => {
      setSomeError(error);
    },
  });

  const saveRecipe = () => {
    const form = recipeForm.current! as IRecipeForm;
    const name = form.recipeName.value;
    addRecipe({ variables: { name } });
    form.recipeName.value = '';
    setSimilarRecipes([]);
  };

  const onRecipeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = recipeForm.current! as IRecipeForm;
    const name = form.recipeName.value;
    const similarRecipesFound = getSimilarRecipeByName(name, recipes);
    setSimilarRecipes(similarRecipesFound);
    if (similarRecipesFound.length === 0) {
      saveRecipe();
    } else {
      setNamesModal(true);
    }
  };

  return (
    <Paper style={{ paddingTop: 12 }}>
      <SimilarNamesDialog
        similarRecipes={similarRecipes}
        open={namesModal}
        onClose={setNamesModal}
        confirmButton={sendingButton(sending, 'Confirmar', {
          someError,
          onClick: () => {
            saveRecipe();
            setNamesModal(false);
          },
        })}
      />
      <form ref={recipeForm} onSubmit={onRecipeSubmit}>
        <Grid container alignItems="center" justify="center" spacing={3}>
          <Grid item>
            <TextField required name="recipeName" label="Nombre receta" />
          </Grid>
          <Grid item>{sendingButton(sending, 'Agregar', { someError })}</Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddRecipeForm;
