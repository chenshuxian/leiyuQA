import react, {useEffect} from 'react'
import Layout from '../../components/layout'
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'
import router from 'next/router';

export default function Signin () {
    const [ session, loading ] = useSession()
    useEffect(()=>{
        if(session){
            if(!session.reg){
                router.push("/register")
            }
                router.push("/")
        }
      },[session])

  return (
    <Layout>
     <div id="outerWp">
        <div id="inter" className="fbLogin">
            <div id="banner">
                <Image src={mainBanner} alt="mainBanner" className="banImg" />
            </div>
            <div id="contentWp">
                <dl id="main">
                    <dd>
                        <div className="inner">
                            <div className="textTitle">
                                <span></span>
                                <span className="right"></span>
                                <h2>會員登入</h2>
                            </div>
                            <div className="globalContent">
                                <h3>可使用個人Facebook建立帳號或登入</h3>
                                <a href="#" 
                                    onClick={(e) => {
                                        e.preventDefault()
                                        signIn('facebook')
                                     }} className="fb">
                                facebook 登入</a>
                            </div>
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
    </Layout>
  )
}
