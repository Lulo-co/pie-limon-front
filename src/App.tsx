import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import Catalog from "./Catalog";
import './App.css';

function App() {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI
  });

  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Catalog />
      </ApolloProvider>
    </div>
  );
}

export default App;
