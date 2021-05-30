import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { DeleteRecipeData, DELETE_RECIPE, DeleteRecipeVars } from '../app.gql';

interface deleteRecipeResult {
  error?: Error;
  deleteRecipe: (id: string) => void;
  loading: boolean;
  success: boolean;
}

const useDeleteRecipe = (): deleteRecipeResult => {
  const [error, setError] = useState<Error>();
  const [success, setSuccess] = useState<boolean>(false);

  const reportError = (error: Error) => {
    setError(error);
  };
  const [deleteRecipeMutation, { loading }] = useMutation<
    DeleteRecipeData,
    DeleteRecipeVars
  >(DELETE_RECIPE, {
    onCompleted: ({ deleteRecipe }) => {
      if (deleteRecipe) {
        setSuccess(true);
      } else {
        reportError(new Error());
      }
    },
    onError: reportError,
  });

  const deleteRecipe = (id: string) => {
    setSuccess(false);
    setError(undefined);
    deleteRecipeMutation({ variables: { id } });
  };
  return {
    error,
    deleteRecipe,
    loading,
    success,
  };
};

export default useDeleteRecipe;
