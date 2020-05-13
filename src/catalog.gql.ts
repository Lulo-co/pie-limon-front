import { gql } from 'apollo-boost';

export const GET_RECIPES = gql`
  {
    getRecipes {
      id, name
    }
  }
`;

export const ADD_RECIPE = gql`
  mutation addRecipe($name: String!) {
    addRecipe(newRecipe: { name: $name }) {
      id, name
    }
  }
`;

export const UPLOAD_FILE = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: { file: $file }) {
      filename
      mimetype
      encoding
    }
  }
`;
