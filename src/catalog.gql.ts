import { gql } from 'apollo-boost';

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
  recipeId: number;
}

export const GET_RECIPE = gql`
  query getRecipe($recipeId: ID!) {
    getRecipe(recipeId: $recipeId) {
      id
      name
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

export interface UploadPhotoVars {
  file: File;
  recipeId: number;
}

export const UPLOAD_PHOTO = gql`
  mutation attachRecipePhoto($file: Upload!, $recipeId: ID!) {
    attachRecipePhoto(file: { file: $file }, recipeId: $recipeId)
  }
`;
