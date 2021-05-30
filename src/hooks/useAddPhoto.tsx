import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { UploadPhotoVars, UPLOAD_PHOTO } from '../app.gql';

interface uploadPhotoData {
  attachRecipePhoto: boolean;
}

interface addPhotoResult {
  someError?: Error;
  uploadFile: (file: File, recipeId: string) => void;
  loading: boolean;
  success: boolean;
}

const useAddPhoto = (): addPhotoResult => {
  const [someError, setSomeError] = useState<Error>();
  const [success, setSuccess] = useState<boolean>(false);

  const reportError = (error: Error) => {
    setSomeError(error);
  };
  const [uploadFileMutation, { loading }] = useMutation<
    uploadPhotoData,
    UploadPhotoVars
  >(UPLOAD_PHOTO, {
    onCompleted: ({ attachRecipePhoto }) => {
      if (attachRecipePhoto) {
        setSuccess(true);
      } else {
        reportError(new Error());
      }
    },
    onError: reportError,
  });

  const uploadFile = (file: File, recipeId: string) => {
    setSuccess(false);
    setSomeError(undefined);
    uploadFileMutation({ variables: { file, recipeId } });
  };

  return { someError, uploadFile, loading, success };
};

export default useAddPhoto;
