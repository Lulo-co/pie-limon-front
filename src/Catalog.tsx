import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_RECIPES, ADD_RECIPE, UPLOAD_FILE } from './catalog.gql';

interface IRecipeForm {
  recipeName: { value: string };
}

interface IRecipe {
  id: number;
  name: string;
}

function Catalog() {
  const recipeForm = useRef(null);
  const [recipes, setRecipes] = useState(Array<IRecipe>());
  const { loading: loadingRecipes, error: recipesError } = useQuery(
    GET_RECIPES,
    {
      onCompleted: (data) => { setRecipes(data.getRecipes) }
    }
  );
  const [addRecipe, { loading: sending, error: addError }] = useMutation(
    ADD_RECIPE,
    {
      onCompleted: ({ addRecipe }) => { setRecipes(prevState => [...prevState, addRecipe]) }
    }
  );
  const [uploadFile, { loading: sendingFile }] = useMutation(
    UPLOAD_FILE,
    {
      onCompleted: () => {}
    }
  );

  const errors = [recipesError as Error, addError as Error].filter(Boolean);

  const onRecipeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = recipeForm.current! as IRecipeForm;
    const name = form.recipeName.value;
    addRecipe({ variables: { name } });
    form.recipeName.value = '';
  }

  return (
    <div>
      (<form onSubmit={() => { console.log("Submitted") }} encType={'multipart/form-data'}>
        <input name={'document'} type={'file'} onChange={({ target: { files } }) => {
          const file = files![0];
          console.log(file);
          file && uploadFile({ variables: { file: file } })
        }} />{sendingFile && <p>Loading.....</p>}</form>)
      <form ref={recipeForm} onSubmit={onRecipeSubmit}>
        <label>Nombre: </label>
        <input name="recipeName"></input>
        <button
          disabled={sending || !!addError}
        >
          {sending ? '...' : 'Agregar'}
        </button>
      </form>
      <ul>
        {loadingRecipes && (<p>Cargando recetas...</p>)}
        {errors.map((err) => (<p>{err.message}</p>))}
        {recipes.map(({ id, name }) => (<li key={id}>{name}</li>))}
      </ul>
    </div>
  );
}

export default Catalog;
