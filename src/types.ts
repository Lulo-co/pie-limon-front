export interface IRecipe {
  id: string;
  name: string;
  description?: string;
  num_photos: string;
  photos: Array<{ url: string }>;
}

export interface RecipeWrapperChildProps {
  data: IRecipe;
}
