import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient } from "apollo-client";

import Catalog from "./Catalog";
import './App.css';


function App() {
  const uploadLink = createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    headers: {
      "keep-alive": "true"
    }
  })


  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: uploadLink
  })

  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Catalog />
      </ApolloProvider>
    </div>
  );
}

export default App;
