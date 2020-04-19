import React, { useState, useRef } from 'react';

import './App.css';

interface IRecipeForm {
  recipeName: { value: string }
}

function App() {
  const recipeForm = useRef(null);
  const [recipes, setRecipes] = useState(Array<string>());

  const addRecipe = () => {
    const form = recipeForm.current! as IRecipeForm;
    let recipeName = form.recipeName.value;
    setRecipes(prevState => [...prevState, recipeName]);
    form.recipeName.value = '';
  }

  return (
    <div className="App">
      <form ref={recipeForm}>
        <label>Nombre: </label>
        <input name="recipeName"></input>
        <button type="button" onClick={addRecipe}>Agregar</button>
      </form>
      <ul>
        {recipes.map((recipe, i) => (<li key={i}>{recipe}</li>))}
      </ul>
    </div>
  );
}

export default App;
