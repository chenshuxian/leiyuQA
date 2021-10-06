/* eslint-disable @next/next/no-sync-scripts */
import { Provider, useSession, signIn, SessionProvider } from 'next-auth/client'
import React, { useEffect } from "react";
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
import '../public/assets/css/style.css'

// Use the <Provider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App ({ Component, pageProps }) {

  // useEffect(()=>{
  //   window.fbAsyncInit = function(){' '}
  //   {FB.init({
  //     appId: '641136007247701',
  //     autoLogAppEvents: true,
  //     xfbml: true,
  //     version: 'v8.0',
  //   })}
  //   ;
  // })

  return (
    <React.Fragment>
      <Head>
       <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable =no, viewport-fit=cover" />
        <meta property="og:url"           content="https://lieyu.fantasyball.tw/" />
        <meta property="og:type"          content="website" />
        <meta property="og:title"         content="烈嶼知識問答" />
        <meta property="og:description"   content="讓我們經由知識問答小遊戲認識烈嶼取得大獎吧" />
        <meta property="og:image"         content="https://lieyu.fantasyball.tw/assets/images/bannerImg.png" />
        <title>烈嶼鄉知識問答</title>

        <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v12.0&appId=641136007247701&autoLogAppEvents=1" nonce="LOtsuOcU"></script> 
  
      </Head>
    <Provider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      options={{
        // Client Max Age controls how often the useSession in the client should
        // contact the server to sync the session state. Value in seconds.
        // e.g.
        // * 0  - Disabled (always use cache value)
        // * 60 - Sync session state with server if it's older than 60 seconds
        clientMaxAge: 0,
        // Keep Alive tells windows / tabs that are signed in to keep sending
        // a keep alive request (which extends the current session expiry) to
        // prevent sessions in open windows from expiring. Value in seconds.
        //
        // Note: If a session has expired when keep alive is triggered, all open
        // windows / tabs will be updated to reflect the user is signed out.
        keepAlive: 0
      }}
      session={pageProps.session} >
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
    </React.Fragment>
  )
}

function Auth({ children }) {
  const { data: session, loading } = useSession()
  const isUser = !!session?.user
  console.log(`Auth ${JSON.stringify(session)}`)
  React.useEffect(() => {
    if (loading) return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, loading])
  //console.log('authisUser' + isUser)
  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}