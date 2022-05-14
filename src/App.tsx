import { useEffect, useState, useCallback } from 'react';
import './App.css';

function App() {
  const CLIENT_ID = '974916820257619970';
  const SECRET = 'VL_TK8-JHUIkxPN9zn2Hs3LSrpwJnbiV';
  const REDIRCT_URL = 'https://koor.github.io/discord-oauth/';
  const [userInfo, setUserInfo] = useState<any>(null);

  const connect = () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRCT_URL}&response_type=code&scope=identify`;
    window.location.href = authUrl;
  };

  const getUserInfo = useCallback(async (token: string) => {
    const res = await (
      await fetch('https://discordapp.com/api/users/@me', {
        method: 'GET',
        headers: {
          authorization: token
        }
      })
    ).json();
    res.code !== 0 && setUserInfo(res);
  }, []);

  const getToken = useCallback(async () => {
    const params = {
      client_id: CLIENT_ID,
      client_secret: SECRET,
      grant_type: 'authorization_code',
      code: getUrlParams('code'),
      redirect_uri: REDIRCT_URL
    };

    const formBody = Object.keys(params)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      )
      .join('&');

    const res = await (
      await fetch('https://discordapp.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
      })
    ).json();

    if (res.error) {
      alert(res.error_description);
    } else {
      getUserInfo(`${res.token_type} ${res.access_token}`);
    }
  }, [getUserInfo]);

  const getUrlParams = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    getUrlParams('code') && getToken();
    getUrlParams('error') && alert(getUrlParams('error_description'));
  }, [getToken]);

  return (
    <div className="App">
      <h1>Discord OAuth Example</h1>
      <button onClick={connect}>Connect Discord</button>

      {userInfo ? (
        <>
          <p>Name: {`${userInfo.username} #${userInfo.discriminator}`}</p>
          <p>
            Avatar:{' '}
            <img
              src={`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`}
              alt="avatar"
            />
          </p>
        </>
      ) : null}
    </div>
  );
}

export default App;
