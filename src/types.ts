export interface IRecipe {
  id: number;
  name: string;
  description?: string;
  photos: Array<{ url: string }>;
  num_photos: string;
}

export interface RecipeWrapperChildProps {
  data: IRecipe;
}
