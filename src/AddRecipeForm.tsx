import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import * as SS from 'string-similarity';
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import CloseIcon from '@material-ui/icons/Close';
import NewReleasesSharpIcon from '@material-ui/icons/NewReleasesSharp';
import React, { useRef, useState } from 'react';

import { AddRecipeVars, ADD_RECIPE } from './catalog.gql';
import { IRecipe } from './types';
import { viewRecipe } from './Routes';

interface IRecipeForm {
  recipeName: { value: string };
}

interface AddRecipeData {
  addRecipe: IRecipe;
}

interface AddRecipeFormProps {
  recipesRefetch: () => void;
  setSomeError: (error: Error) => void;
  someError: Error | null;
  recipes: IRecipe[];
}

interface SimilarNamesDialogProps {
  similarRecipes: IRecipe[];
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  confirmButton: JSX.Element;
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

const SimilarNamesDialog: React.FC<SimilarNamesDialogProps> = (props) => {
  const { similarRecipes, open, onClose, confirmButton } = props;
  return (
    <Dialog
      fullWidth
      onClose={() => onClose(false)}
      aria-labelledby="names-modal-title"
      aria-describedby="names-modal-desc"
      open={open}
    >
      <DialogTitle
        disableTypography
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Typography variant="h6" id="names-modal-title">
          Se encontraron recetas con nombres similares!
        </Typography>
        <IconButton aria-label="close" onClick={() => onClose(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom id="names-modal-desc">
          Por favor confirmar para agregar la receta.
        </Typography>
        <List dense={true}>
          {similarRecipes.map((r) => (
            <ListItem
              key={r.id}
              button
              component={Link}
              to={`${viewRecipe(r.id)}`}
            >
              <ListItemIcon>
                <NewReleasesSharpIcon />
              </ListItemIcon>
              <ListItemText primary={r.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => onClose(false)}
        >
          Cancelar
        </Button>
        {confirmButton}
      </DialogActions>
    </Dialog>
  );
};

const addButton = (
  sending: boolean,
  someError: Error | null,
  text: string,
  onClick?: () => void
): JSX.Element => (
  <Button
    variant="outlined"
    color="primary"
    startIcon={<AddTwoToneIcon />}
    onClick={() => {
      onClick?.();
    }}
    disabled={sending || !!someError}
    type="submit"
  >
    {sending ? '...' : text}
  </Button>
);

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
        confirmButton={addButton(sending, someError, 'Confirmar', () => {
          saveRecipe();
          setNamesModal(false);
        })}
      />
      <form ref={recipeForm} onSubmit={onRecipeSubmit}>
        <Grid container alignItems="center" justify="center" spacing={3}>
          <Grid item>
            <TextField required name="recipeName" label="Nombre receta" />
          </Grid>
          <Grid item>{addButton(sending, someError, 'Agregar')}</Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddRecipeForm;
