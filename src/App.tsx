import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import CssBaseline from '@material-ui/core/CssBaseline';
import KitchenTwoToneIcon from '@material-ui/icons/KitchenTwoTone';
import React from 'react';

import Catalog from './Catalog';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';

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
      <AppBar position="relative">
        <Toolbar>
          <KitchenTwoToneIcon />
          <Typography variant="h6" color="inherit" noWrap>
            Recetas
          </Typography>
        </Toolbar>
      </AppBar>
      <ApolloProvider client={client}>
        <Container>
          <Catalog />
        </Container>
      </ApolloProvider>
    </div>
  );
}

export default App;
