import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import NewReleasesSharpIcon from '@material-ui/icons/NewReleasesSharp';
import React from 'react';

import { viewRecipe } from '../../Routes';
import { IRecipe } from '../../types';

interface SimilarNamesDialogProps {
  similarRecipes: IRecipe[];
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  confirmButton: JSX.Element;
}

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

export default SimilarNamesDialog;
