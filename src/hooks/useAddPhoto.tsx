import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { UploadPhotoVars, UPLOAD_PHOTO } from '../app.gql';

interface uploadPhotoData {
  attachRecipePhoto: boolean;
}

const useAddPhoto = (onSuccess: (a: boolean) => void) => {
  const [someError, setSomeError] = useState<Error>();
  const reportError = (error: Error) => {
    setSomeError(error);
  };
  const [uploadFile, { loading }] = useMutation<
    uploadPhotoData,
    UploadPhotoVars
  >(UPLOAD_PHOTO, {
    onCompleted: ({ attachRecipePhoto }) => {
      if (attachRecipePhoto) {
        onSuccess(attachRecipePhoto);
      } else {
        reportError(new Error());
      }
    },
    onError: reportError,
  });

  return { someError, setSomeError, uploadFile, loading };
};

export default useAddPhoto;
