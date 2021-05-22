import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';
import CssBaseline from '@material-ui/core/CssBaseline';
import KitchenTwoToneIcon from '@material-ui/icons/KitchenTwoTone';
import React, { useState } from 'react';

import * as Routes from './Routes';
import Catalog from './Catalog';
import EditRecipe from './EditRecipe';
import Oops from './Oops';
import RecipeDetail from './RecipeDetail';

import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [isAllowed, setIsAllowed] = useState(true);

  const uploadLink = createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    headers: {
      'keep-alive': 'true',
      Authorization: token,
    },
  });

  const authLink = onError((errorResponse) => {
    const a403 = errorResponse.graphQLErrors?.some(
      (error) => error.extensions?.exception.status === 403
    );
    if (a403) setIsAllowed(false);
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(uploadLink),
  });

  const loadRoute = (OkComponent: React.FC) => (): JSX.Element => {
    if (!token || !isAllowed) {
      return (
        <Oops
          loggedIn={token ? true : false}
          allowed={isAllowed}
          setToken={setToken}
        />
      );
    }
    return <OkComponent />;
  }; 

  return (
    <div className="App">
      <CssBaseline />
      <Router>
        <AppBar position="relative">
          <Toolbar>
            <Link to={Routes.root} style={{ display: 'inline-flex' }}>
              <KitchenTwoToneIcon />
              <Typography variant="h6" color="inherit" noWrap>
                Recetas
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
        <ApolloProvider client={client}>
          <Container>
            <Switch>
              <Route
                path={`${Routes.editRecipe()}`}
                render={loadRoute(EditRecipe)}
              />
              <Route
                path={`${Routes.viewRecipe()}`}
                render={loadRoute(RecipeDetail)}
              />
              <Route path={Routes.root()} render={loadRoute(Catalog)} />
            </Switch>
          </Container>
        </ApolloProvider>
      </Router>
    </div>
  );
}

export default App;
