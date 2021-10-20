import react, {useEffect} from 'react'
import { getCsrfToken,useSession, signIn } from "next-auth/client"
import AdminLayout from "../../components/adminLayout"
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import router from 'next/router';

export default function SignIn({ csrfToken }) {
    const [ session, loading ] = useSession()
    useEffect(()=>{
        if(session){
            if(session.isAdmin){
                router.push("/admin")
            }else{
                router.push("/admin/login")
            }
                
        }
      },[session])
  return (
    <AdminLayout>
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
                               <h2>管理者登入</h2>
                           </div>
                           <div className="globalContent">
                          
                            <button style={{zIndex:2, position:"relative"}} onClick={()=>{
                                console.log('credentials')
                                signIn("credentials", { username: "jacky", password: "admin" })}
                                }>Sign in</button>
   
                           </div>
                       </div>
                   </dd>
               </dl>
           </div>
       </div>
   </div>
   </AdminLayout>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context)
  }
}
*/