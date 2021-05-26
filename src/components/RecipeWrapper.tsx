import React from 'react';
import { useParams } from 'react-router-dom';

import useGetRecipe from '../hooks/useGetRecipe';
import { IRecipe } from '../types';

interface RecipeRouteParams {
  id: string;
}

interface RecipeWrapperProps {
  Component: React.ComponentType<RecipeWrapperChildProps>;
}

export interface RecipeWrapperChildProps {
  data: IRecipe;
  refetch: () => void;
}

const RecipeWrapper: React.FC<RecipeWrapperProps> = ({ Component }) => {
  const { id } = useParams<RecipeRouteParams>();
  const { loading, data, error, refetch } = useGetRecipe(id);

  if (error) return error;
  if (loading) return loading;
  if (!data) return loading;
  return (
    <Component
      data={data}
      refetch={() => {
        refetch();
      }}
    />
  );
};

export default RecipeWrapper;
