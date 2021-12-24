import react, {useEffect} from 'react'
import { getCsrfToken,useSession, signIn } from "next-auth/client"
import AdminLayout from "../../components/adminLayout"
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import router from 'next/router';
import { Form, Col, Button } from 'react-bootstrap'

export default function SignIn({ csrfToken }) {
    const [ session, loading ] = useSession()
    // useEffect(()=>{
    //     if(session){
    //         if(session.isAdmin){
    //             router.push("/admin")
    //         }else{
    //             router.push("/admin/login")
    //         }
                
    //     }
    //   },[session])

      const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(document.getElementById('form'));
        const data = {callbackUrl: 'https://localhost/admin/', 'username': formData.get('account'), 'password': formData.get('pw') }
        signIn("credentials",data)
        //console.log(`login admin: ${JSON.stringify(formData)} pw: ${formData.password}`)
      }
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
                            <Form id="form" style={{margin:"auto", width:"50%"}} onSubmit={handleSubmit}>
                                <Form.Row xs={12} md={6}>
                                  <Form.Group as={Col}  controlId="account" >
                                    <Form.Label>帳號: </Form.Label>
                                    <Form.Control type="text" defaultValue="admin" name="account"></Form.Control>
                                  </Form.Group>
                                </Form.Row>
                                <Form.Row xs={12} md={6}>
                                <Form.Group as={Col}  controlId="password">
                                    <Form.Label>密碼: </Form.Label>
                                    <Form.Control type="password" name="pw" ></Form.Control>
                                  </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Button type="submit">登入</Button>
                                </Form.Row>
                            </Form>
   
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