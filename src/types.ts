export interface IRecipe {
  id: number;
  name: string;
  description?: string;
  photos: Array<{ url: string }>;
}
