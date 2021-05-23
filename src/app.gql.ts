import { gql } from '@apollo/client';

export const GET_RECIPES = gql`
  {
    getRecipes {
      id
      name
      photos {
        id
      }
    }
  }
`;

export interface GetRecipeVars {
  recipeId: string;
}

export const GET_RECIPE = gql`
  query getRecipe($recipeId: ID!) {
    getRecipe(recipeId: $recipeId) {
      id
      name
      description
      photos {
        url
      }
    }
  }
`;

export interface AddRecipeVars {
  name: string;
}

export const ADD_RECIPE = gql`
  mutation addRecipe($name: String!) {
    addRecipe(newRecipe: { name: $name }) {
      id
    }
  }
`;

export interface EditRecipeVars {
  id: number;
  description: string;
}

export const EDIT_RECIPE = gql`
  mutation editRecipe($id: ID!, $description: String) {
    editRecipe(recipe: { id: $id, description: $description }) {
      id
    }
  }
`;

export interface UploadPhotoVars {
  file: File;
  recipeId: number;
}

export const UPLOAD_PHOTO = gql`
  mutation attachRecipePhoto($file: Upload!, $recipeId: ID!) {
    attachRecipePhoto(file: { file: $file }, recipeId: $recipeId)
  }
`;
