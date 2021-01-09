import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { createUploadLink } from 'apollo-upload-client';
import CssBaseline from '@material-ui/core/CssBaseline';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import KitchenTwoToneIcon from '@material-ui/icons/KitchenTwoTone';
import React, { useState } from 'react';

import { PAGES } from './AppConstants';
import Catalog from './Catalog';
import RecipeDetail from './RecipeDetail';

import './App.css';

function App() {
  const [token, setToken] = useState('');

  const uploadLink = createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    headers: {
      'keep-alive': 'true',
      'Authorization': token,
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
            {token ? (
              <Switch>
                <Route path={`${PAGES.RECIPE_DETAIL}:id`}>
                  <RecipeDetail />
                </Route>
                <Route path={PAGES.ROOT}>
                  <Catalog />
                </Route>
              </Switch>
            ) : (
                <GoogleLogin
                  clientId={process.env.REACT_APP_GCLIENT_ID || ''}
                  buttonText="Login"
                  onSuccess={(response) => { setToken((response as GoogleLoginResponse).tokenId) }}
                  onFailure={(p) => { console.error('failure', p) }}
                  cookiePolicy={'single_host_origin'}
                  isSignedIn
                />
              )}
          </Container>
        </ApolloProvider>
      </Router>
    </div>
  );
}

export default App;
