import React, { useState } from 'react';

interface RecipePhotoProps {
  url: string;
  visible: boolean;
}

const RecipePhoto: React.FC<RecipePhotoProps> = ({ url, visible }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <>
      {isLoading && visible && <span>cargando imagen</span>}
      {error && <span>Error cargando imagen</span>}
      {visible && (
        <img
          style={{ maxWidth: '100%' }}
          src={url}
          alt="Foto de receta"
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={() => {
            setError(true);
          }}
        />
      )}
    </>
  );
};
export default RecipePhoto;
