// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';
import CssBaseline from '@material-ui/core/CssBaseline';
import KitchenTwoToneIcon from '@material-ui/icons/KitchenTwoTone';
import React, { useEffect, useState } from 'react';

import { PAGES } from './AppConstants';
import Catalog from './Catalog';
import Oops from './Oops';
import RecipeDetail from './RecipeDetail';

import './App.css';

const firebaseConfig = {
  apiKey: 'AIzaSyCj-iE7YWPnhgj5X_xgUW6kBgJZOda196U',
  authDomain: 'another-todo-list-test.firebaseapp.com',
  projectId: 'another-todo-list-test',
  storageBucket: 'another-todo-list-test.appspot.com',
  messagingSenderId: '987286496587',
  appId: '1:987286496587:web:d0f64e29f8ae4ff869f4ce',
  measurementId: 'G-9EQK7R14WF',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const uiConfig = {
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: (authResult: any, redirectUrl: string) => {
      console.log(authResult);
      console.log(redirectUrl);
      return false;
    },
  },
};

function App() {
  const [token, setToken] = useState('a');
  const [isAllowed, setIsAllowed] = useState(true);
 
  

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     console.log('onAuthStateChanged', user, user?.toJSON());
  //     if (user && user.displayName) setUser(user.displayName);
  //     if (!user) {
  //       const ui = new firebaseui.auth.AuthUI(firebase.auth());

  //       ui.start('#firebase-auth', {
  //         signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  //         callbacks: {
  //           signInSuccessWithAuthResult: (
  //             authResult: any,
  //             redirectUrl: string
  //           ) => {
  //             console.log(authResult);
  //             console.log(redirectUrl);
  //             return false;
  //           },
  //         },
  //       });
  //     }
  //   });
  // }, []);

  // const uploadLink = createUploadLink({
  //   uri: process.env.REACT_APP_GRAPHQL_URI,
  //   headers: {
  //     'keep-alive': 'true',
  //     Authorization: token,
  //   },
  // });

  // const authLink = onError((errorResponse) => {
  //   const a403 = errorResponse.graphQLErrors?.some(
  //     (error) => error.extensions?.exception.status === 403
  //   );
  //   if (a403) setIsAllowed(false);
  // });

  // const client = new ApolloClient({
  //   cache: new InMemoryCache(),
  //   link: authLink.concat(uploadLink),
  // });

  // const loadRoute = (OkComponent: React.FC) => (): JSX.Element => {
  //   if (!token || !isAllowed) {
  //     return (
  //       <Oops
  //         loggedIn={user ? true : false}
  //         allowed={isAllowed}
  //         setToken={setToken}
  //       />
  //     );
  //   }
  //   return <OkComponent />;
  // };

  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {firebase.auth().currentUser!.displayName}! You are now signed-in!</p>
      <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </div>
  );

  // return (
  //   <div className="App">
  //     <CssBaseline />
  //     <Router>
  //       <AppBar position="relative">
  //         <Toolbar>
  //           <Link to={PAGES.ROOT} style={{ display: 'inline-flex' }}>
  //             <KitchenTwoToneIcon />
  //             <Typography variant="h6" color="inherit" noWrap>
  //               Recetas
  //             </Typography>
  //           </Link>
  //         </Toolbar>
  //       </AppBar>
  //       {/* <ApolloProvider client={client}> */}
  //       <Container>
  //         <StyledFirebaseAuth
  //           uiConfig={uiConfig}
  //           firebaseAuth={firebase.auth()}
  //         />
  //         <Switch>
  //           <Route
  //             path={`${PAGES.RECIPE_DETAIL}:id`}
  //             render={loadRoute(RecipeDetail)}
  //           />
  //           <Route path={PAGES.ROOT} render={loadRoute(Catalog)} />
  //         </Switch>
  //       </Container>
  //       {/* </ApolloProvider> */}
  //     </Router>
  //   </div>
  // );
}

export default App;
