import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import CssBaseline from '@material-ui/core/CssBaseline';
import KitchenTwoToneIcon from '@material-ui/icons/KitchenTwoTone';
import React from 'react';

import { PAGES } from './AppConstants';
import Catalog from './Catalog';
import RecipeDetail from './RecipeDetail';

import './App.css';

function App() {
  const uploadLink = createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    headers: {
      'keep-alive': 'true',
    },
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: uploadLink,
  });

  return (
    <div className="App">
      <CssBaseline />
      <Router>
        <AppBar position="relative">
          <Toolbar>
            <Link to={PAGES.ROOT} style={{ display: 'inline-flex' }}>
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
              <Route path={`${PAGES.RECIPE_DETAIL}:id`}>
                <RecipeDetail />
              </Route>
              <Route path={PAGES.ROOT}>
                <Catalog />
              </Route>
            </Switch>
          </Container>
        </ApolloProvider>
      </Router>
    </div>
  );
}

export default App;
