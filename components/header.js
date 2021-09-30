import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/assets/images/logo.png'
import fbLogo from '../public/assets/images/fbLogo.png'
import userIcon from '../public/assets/images/userIcon.png'
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
        router.push("/register")
      }else{
        router.push("/")
      }
    }
    if(session){
    fetchData(session)
    }
  },[session])
  
  return (
    <header className="fixNav">
    <a className="target-burger">
        <ul className="buns">
            <li className="bun"></li>
            <li className="bun"></li>
        </ul>
    </a>
    <div className="inner">
        <a href="" className="logo">
            <Image src={logo} alt="logo"/>
        </a>
        <nav className="main-nav" role="navigation">
            <ul id="globalMu">
                <li><Link href="/#game">開始遊戲</Link></li>
                <li><Link href="/#gift">遊戲獎品</Link></li>
                <li><Link href="userProfile">會員摸彩</Link></li>
                <li><Link href="/#evenInfo">活動說明</Link></li>
                <li><Link href="score">烈嶼鄉公所</Link></li>
            </ul>
            <div className="otherLink">
                <ul>
                {!session &&
                <>
                    <li>
                        <a href={`/api/auth/signin`}
                            onClick={(e) => {
                              e.preventDefault()
                              signIn()
                            }}>
                            <Image src={fbLogo} alt="fbLogo" />
                        </a>
                    </li>
                </>}
                {session && <>
                    <li>
                        <a href={`/api/auth/signout`}
                            className={styles.button}
                            onClick={(e) => {
                              e.preventDefault()
                              signOut()
                            }}>
                        {session.user.image && <span style={{backgroundImage: `url(${session.user.image})` }} className={styles.avatar}/>}
                        </a>
                    </li>
                </>}
                </ul>
            </div>
        </nav>
    </div>
</header>
  )
}
