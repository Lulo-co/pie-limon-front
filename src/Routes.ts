const root = () => '/';

const viewRecipe = (id?: number) => `/recipe/${id ? id : ':id'}`;

const editRecipe = (id?: number) => `/recipe/${id ? id : ':id'}/edit/`;

export {
  root,
  viewRecipe,
  editRecipe,
};
