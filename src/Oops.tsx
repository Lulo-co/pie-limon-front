import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';

interface Props {
  loggedIn: boolean;
  allowed: boolean;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const Oops: React.FC<Props> = (props) => {
  const { loggedIn, allowed, setToken } = props;
  let title = 'Ups... ¿Cómo changos llegaste aquí?';
  if (!loggedIn) title = 'Para empezar, logueate con google';
  else if (!allowed) title = 'Sorry, Fuchi de aquí';

  return (
    <Grid
      container
      direction="column"
      justify="space-around"
      alignItems="center"
      style={{ marginTop: 5 }}
    >
      <Grid item style={{ textAlign: 'center', width: 300, padding: 10 }}>
        <Paper style={{ padding: 15 }} elevation={3}>
          <Typography
            variant="h5"
            component="h2"
            color="textSecondary"
            gutterBottom
          >
            {title}
          </Typography>
          {!loggedIn && (
            <Typography>
              <GoogleLogin
                clientId={process.env.REACT_APP_GCLIENT_ID || ''}
                buttonText="Login"
                onSuccess={(response) => {
                  setToken((response as GoogleLoginResponse).tokenId);
                }}
                onFailure={(p) => {
                  console.error('failure', p);
                }}
                cookiePolicy={'single_host_origin'}
                isSignedIn
              />
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Oops;
