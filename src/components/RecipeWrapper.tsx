import React from 'react';
import { useParams } from 'react-router-dom';

import useGetRecipe from '../hooks/useGetRecipe';
import { RecipeWrapperChildProps } from '../types';

interface RecipeRouteParams {
  id: string;
}

interface RecipeWrapperProps {
  Component: React.ComponentType<RecipeWrapperChildProps>;
}

const RecipeWrapper: React.FC<RecipeWrapperProps> = ({ Component }) => {
  const { id } = useParams<RecipeRouteParams>();
  const { loading, data, error } = useGetRecipe(id);

  if (error) return error;
  if (loading) return loading;
  if (!data) return loading;
  return <Component data={data} />;
};

export default RecipeWrapper;
