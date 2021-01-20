import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@material-ui/core';
import React from 'react';
import RecipeRow from './RecipeRow';
import { IRecipe } from './types';

interface RecipeListProps {
  recipes: IRecipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} style={{ width: '85%' }}>
              Nombre
            </TableCell>
            <TableCell align="right" style={{ width: '5%' }}>
              <IconButton
                title="Fotos por receta"
                size="small"
                style={{
                  backgroundColor: 'transparent',
                  cursor: 'default',
                }}
              >
                <PhotoLibraryIcon />
              </IconButton>
            </TableCell>
            <TableCell align="right" style={{ width: '10%' }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipes.map((recipe) => (
            <RecipeRow recipe={recipe} key={recipe.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecipeList;
