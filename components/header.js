import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/assets/images/logo.png'
import fbLogo from '../public/assets/images/fbLogo.png'
import userIcon from '../public/assets/images/userIcon.png'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useState, useEffect } from 'react'
import styles from './header.module.css'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.

export default function Header () {
  const [ session, loading ] = useSession()
  const [ toggled, setToggle] = useState(false)
  const router = useRouter()

	{/*   useEffect(()=>{
     if(session){
         if(!session.reg){
             router.push("/register")
         }
     }
   },[session])*/}
  const toggle = () => {
      if(!toggled){
        document.getElementsByTagName('body')[0].className ='toggled'
        document.getElementsByTagName('header')[0].className ='fixNav toggled'
      }else{
        document.getElementsByTagName('body')[0].className ='' 
        document.getElementsByTagName('header')[0].className ='fixNav' 
      }
      setToggle(!toggled)
  }
  
  return (
    <header className="fixNav">
    <a className="target-burger">
        <ul className="buns" onClick={toggle}>
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
                <li><Link href="/#evenInfo">活動說明</Link></li>
                <li><Link href="/qa/669c21ce-0505-40cd-b479-19a8b700dab5">開始遊戲</Link></li>
                <li><Link href="/#gift">遊戲獎品</Link></li>
                {/* <li><Link href="/auth/lottery">會員摸彩</Link></li> */}
                <li><a target="_blank" href="https://lieyu.kinmen.gov.tw/travel/" rel="noreferrer">烈嶼旅遊網</a></li>
            </ul>
            <div className="otherLink">
                <ul>
                {(!session || session.isAdmin) &&
                <>
                    <li>
                        {/* <a href={`/api/auth/signin`}
                            onClick={(e) => {
                              e.preventDefault()
                              signIn()
                            }}> */}
                            {/* <Image src={fbLogo} alt="fbLogo" /> */}
                            <Button style={{ margin: 10, borderRadius:180}} onClick={(e) => {
                              e.preventDefault()
                              signIn()
                            }}>登入</Button>
                        {/* </a> */}
                    </li>
                </>}
                {session && <>
                    <li>
                        <a href=""
                            className={styles.button}
                            onClick={(e) => {
                              e.preventDefault()
                              router.push("/userProfile")
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
