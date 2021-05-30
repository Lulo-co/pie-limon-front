import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { DeletePhotoData, DELETE_PHOTO, DeletePhotoVars } from '../app.gql';

interface deletePhotoResult {
  error?: Error;
  deletePhoto: (url: string) => void;
  loading: boolean;
  success: boolean;
}

const useDeletePhoto = (): deletePhotoResult => {
  const [error, setError] = useState<Error>();
  const [success, setSuccess] = useState<boolean>(false);

  const reportError = (error: Error) => {
    setError(error);
  };
  const [deletePhotoMutation, { loading }] = useMutation<
    DeletePhotoData,
    DeletePhotoVars
  >(DELETE_PHOTO, {
    onCompleted: ({ deleteRecipePhoto }) => {
      if (deleteRecipePhoto) {
        setSuccess(true);
      } else {
        reportError(new Error());
      }
    },
    onError: reportError,
  });

  const deletePhoto = (url: string) => {
    setSuccess(false);
    setError(undefined);
    deletePhotoMutation({ variables: { url } });
  };
  return {
    error,
    deletePhoto,
    loading,
    success,
  };
};

export default useDeletePhoto;
