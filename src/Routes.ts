const root = () => '/';

const viewRecipe = (id?: string) => `/recipe/${id ? id : ':id'}`;

const editRecipe = (id?: string) => `/recipe/${id ? id : ':id'}/edit/`;

export { root, viewRecipe, editRecipe };
