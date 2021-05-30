export interface IRecipe {
  id: string;
  name: string;
  description?: string;
  num_photos: string;
  photos: Array<IRecipePhoto>;
}

export interface IRecipePhoto {
  url: string;
}
