import * as React from 'react';

import { Container, useTheme } from '@mui/joy';

import { NoSSR } from '@/common/components/NoSSR';
import { isValidOpenAIApiKey } from '@/modules/openai/openai.client';
import { useSettingsStore } from '@/common/state/store-settings';

import { Chat } from '../src/apps/chat/Chat';
import { SettingsModal } from '../src/apps/settings/SettingsModal';
import {googleLogout, GoogleOAuthProvider, useGoogleLogin} from "@react-oauth/google";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, CardContent, Grid} from "@mui/material";

export default function Home() {
  // state
  const [settingsShown, setSettingsShown] = React.useState(false);

  // external state
  const theme = useTheme();
  const apiKey = useSettingsStore(state => state.apiKey);
  const centerMode = useSettingsStore(state => state.centerMode);


  // show the Settings Dialog at startup if the API key is required but not set
  // React.useEffect(() => {
  //   if (!process.env.HAS_SERVER_KEY_OPENAI && !isValidOpenAIApiKey(apiKey))
  //     setSettingsShown(true);
  // }, [apiKey]);





  if (typeof window !== 'undefined') {
    console.log('we are running on the client')
  } else {
    console.log('we are running on the server');
  }

  const [profile, setProfile] = useState([]);
    //google auth

  const [userobj, setUserobj] = useState(() => {
    if (typeof window !== 'undefined') {
      JSON.parse(localStorage.getItem('userobj') as string);
    }
  });


  useEffect(
    () => {
      console.log("running effect");
      console.log(userobj);
      if (userobj) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userobj.access_token}`, {
            headers: {
              Authorization: `Bearer ${userobj.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    },
    [userobj]
  );


  const handlelogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUserobj(codeResponse);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userobj', JSON.stringify(codeResponse));
      }
      console.log(codeResponse);
    },
    onError: (error) => console.log('Login Failed:', error)
  });
    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
      googleLogout();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userobj');
      }
      setProfile(null);
    };


  //====================================


  return (
    /**
     * Note the global NoSSR wrapper
     *  - Even the overall container could have hydration issues when using localStorage and non-default maxWidth
     */
    <NoSSR>

        {profile?.id ? (
            <div>
                <img src={profile.picture} alt="user image"/>
                <h3>User Logged in</h3>
                <p>Name: {profile.name}</p>
                <p>Email Address: {profile.email}</p>
                <button onClick={logOut}>Log out</button>

            <Container maxWidth={centerMode === 'full' ? false : centerMode === 'narrow' ? 'md' : 'xl'} disableGutters sx={{
                boxShadow: {
                    xs: 'none',
                    md: centerMode === 'narrow' ? theme.vars.shadow.md : 'none',
                    xl: centerMode !== 'full' ? theme.vars.shadow.lg : 'none',
                },
            }}>
                <Chat onShowSettings={() => setSettingsShown(true)} />

                <SettingsModal open={settingsShown} onClose={() => setSettingsShown(false)} />

            </Container>
            </div>
        ) : (
                <div>

      <Grid container justifyContent={"center"} spacing={2}>
        <Grid item xs={10} md={8}>
          <Card >
            <CardContent>
              <h2>Welcome Digitalist GPT</h2>
            </CardContent>
            <Button variant="contained" onClick={handlelogin}>
              Login
            </Button>
            {/*<button onClick={() => handlelogin()}>Sign in with Google 🚀</button>*/}
          </Card>

        </Grid>
      </Grid>
                </div>
)}




    </NoSSR>
  );
}