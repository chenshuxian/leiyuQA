import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/assets/images/logo.png'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useState, useEffect } from 'react'
import styles from './header.module.css'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.

export default function AdminHeader () {
  const [ session, loading ] = useSession()
  const [ toggled, setToggle] = useState(false)
  const router = useRouter()

//   useEffect(()=>{
//     if(session){
//         if(session.reg){
//             router.push("/register")
//         }
//     }
//   },[session])
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
                <li><Link href="/#evenInfo">題庫管理</Link></li>
                <li><Link href="/#game">題庫類別管理</Link></li>
                <li><Link href="/#gift">數據統計</Link></li>
                <li><Link href="/auth/lottery">會員摸彩</Link></li>
            </ul>
            <div className="otherLink">
                <ul>
                    <li>
                       <Button>登出</Button>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</header>
  )
}
