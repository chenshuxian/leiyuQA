import react,{useState, useEffect} from 'react'
import Layout from '../components/layout'
import Image from 'next/image'
import mainBanner from '../public/assets/images/mainBanner.png';
import { postData } from '../libs/fetch';
import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { Button } from 'react-bootstrap';
// 

function UserProfile () {
    const [session, loading] = useSession()
    // console.log(`userProfile: ${JSON.stringify(session)}`)
    const [form, setForm] = useState({
        name: '',
        phone: '',
        addr: '',
        id: session ? session.id : ''
    })

    useEffect(()=>{
        if(session){
          document.getElementById("name").value = session.user.name
          document.getElementById("phone").value = session.user.phone
          document.getElementById("addr").value = session.user.addr
          Object.assign(form,{name:session.user.name,phone:session.user.phone,addr:session.user.addr})
          setForm(form)
        }
      }, [session, form])

    const changeState = (e) => {
        console.log(`changeState: ${e.target.value}`)
        let changeName = e.target.name
            //再把他目前的value拿去更改state
        Object.assign(form,{ [changeName]: e.target.value })
        setForm(form)
    }

    const submitForm = async (e) => {
        e.preventDefault();
        console.log(`formData : ${JSON.stringify(form)}`);
        const res = await postData('/api/register',form)
        .then(data => {
            console.log(data)
            if(data.success){
                console.log("會員資料修改完成")
            }
           
        })
        .catch(error => console.error(error))
        
    }
    
  return (
    <Layout>
      <div id="outerWp">
        <div id="inter" className="userProfile">
            <div id="banner">
            <Image src={mainBanner} alt="mainBanner" class="banImg" />
            </div>
            <div id="contentWp">
                <dl id="main">
                    <dd>
                        <div className="inner">
                            <div className="textTitle">
                                <span></span>
                                <span className="right"></span>
                                <h2>會員資訊頁</h2>
                            </div>
                            <div className="globalContent">
                                <ul className="input">
                                <form onSubmit={submitForm}>
                                    <li><b>姓名</b><input type="text" id="name" name="name"  onChange={changeState}/></li>
                                    <li><b>手機</b><input type="text" id="phone" name="phone"  onChange={changeState}/></li>
                                    <li><b>地址</b><input type="text" id="addr" name="addr"  onChange={changeState}/></li>
                                    <li><input type="submit" value="修改" /></li>
                                </form>
                                </ul>
                                <table>
                                    <col width="33%" />
                                    <col width="33%" />
                                    <col width="33%" />
                                    <thead>
                                        <tr>
                                            <td>月份</td>
                                            <td>摸彩卷</td>
                                            <td>是否中獎</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>ticker88</td>
                                            <td>中</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* <ul className="pageNum">
                                    <li><a href="">上一頁</a></li>
                                    <li><a href="" className="active">1</a></li>
                                    <li><a href="">2</a></li>
                                    <li><a href="">3</a></li>
                                    <li><a href="">4</a></li>
                                    <li><a href="">5</a></li>
                                    <li><a href="">6</a></li>
                                    <li><a href="">7</a></li>
                                    <li><a href="">8</a></li>
                                    <li><a href="">9</a></li>
                                    <li><a href="">10</a></li>
                                    <li><a href="">下一頁</a></li>
                                </ul> */}
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

export default UserProfile;