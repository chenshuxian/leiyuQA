/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import Layout from '../components/layout'
import Image from 'next/image'
import mainBanner from '../public/assets/images/mainBanner.png';
import {  signin, signIn, signOut, useSession } from 'next-auth/client'
import { postData } from '../libs/fetch';
import router from 'next/router';
import axios from 'axios';

export default function Register () {
    const [ session, loading ] = useSession()
    const [form, setForm] = useState({
        name: '',
        phone: '',
        addr: '',
	is_shared: true,
        id: session ? session.id : ''
    })

    useEffect(()=>{
        if(session){
          document.getElementById("name").value = session.user.name
          Object.assign(form,{name:session.user.name})
          setForm(form)
        }else{
          signin()
        }
      },[session])

    const changeState = (e) => {
        console.log(`changeState: ${e.target.value}`)
        let changeName = e.target.name
            //再把他目前的value拿去更改state
        Object.assign(form,{ [changeName]: e.target.value })
        setForm(form)
    }

    const submitForm = async (e) => {
        e.preventDefault();
        // console.log(`reg formData : ${JSON.stringify(form)}`);
        axios.patch('/api/me',form)
        .then(data => {
            // console.log(data)
            window.alert('修改成功');
            router.push("/");
        })
        .catch(error => console.error(error))
        
    }
    
  return (
    <Layout>
      <div id="outerWp">
        <div id="inter" className="loginForm">
            <div id="banner">
            <img className="banImg" src={`/assets/images/bannerImg.png`} alt="gameIcn1" />
            </div>
            <div id="contentWp">
                <dl id="main">
                    <dd>
                        <div className="inner">
                            <div className="textTitle">
                                <span></span>
                                <span className="right"></span>
                                <h2>會員資訊</h2>
                            </div>
                            <div className="globalContent">
                                <h3>
                                    請確實填資料<br />
                                    此為您登入之帳號，得獎時將以您所填之資料與您聯繫，
                                </h3>
                                <form onSubmit={submitForm}>
                                <ul className="input">
                                    <li><b>姓名</b><input type="text" id="name" name="name"  onChange={changeState}/></li>
                                    <li><b>手機</b><input type="text" id="phone" name="phone"  onChange={changeState}/></li>
                                    <li><b>地址</b><input type="text" id="addr" name="addr"  onChange={changeState}/></li>
                                </ul>
                                <input type="submit" value="確認送出" />
                                </form>
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

