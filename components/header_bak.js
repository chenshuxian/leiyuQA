import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useState, useEffect } from 'react'
import styles from './header.module.css'
import { useRouter } from 'next/router'

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.

// 取出以下網址asid
// https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10158740544102775&height=50&width=50&ext=1635565413&hash=AeQ-Uqx_Vh1jY2iz-Uk
const getId = async (str) => {
  // console.log(str)
  let id;
  let start, end;
  start = str.indexOf("asid=") + 5;
  end = str.indexOf("&height");
  id = str.substring(start,end);
  return parseInt(id);
}

export default function Header () {
  const [ session, loading ] = useSession()
  const router = useRouter()

  useEffect(()=>{
    const fetchData = async (session) => {
      let id = await getId(session.user.image);
      let data = {id: id};
      const res = await fetch('/api/login',{
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      const json = await res.json()
      if(!json.success){
        router.push("policy")
      }
    }
    if(session){
    fetchData(session)
    }
  },[session])
  
  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p className={`nojs-show ${(!session && loading) ? styles.loading : styles.loaded}`}>
          {!session && <>
            <span className={styles.notSignedInText}>You are not signed in</span>
            <a
                href={`/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign in
              </a>
          </>}
          {session && <>
            {session.user.image && <span style={{backgroundImage: `url(${session.user.image})` }} className={styles.avatar}/>}
            <span className={styles.signedInText}>
              <small>Signed in as</small><br/>
              <strong>{session.user.email || session.user.name}</strong>
              </span>
            <a
                href={`/api/auth/signout`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Sign out
              </a>
          </>}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}><Link href="/"><a>Home</a></Link></li>
          <li className={styles.navItem}><Link href="/client"><a>Client</a></Link></li>
          <li className={styles.navItem}><Link href="/server"><a>Server</a></Link></li>
          <li className={styles.navItem}><Link href="/protected"><a>Protected</a></Link></li>
          <li className={styles.navItem}><Link href="/api-example"><a>API</a></Link></li>
        </ul>
      </nav>
    </header>
  )
}
