import Layout from '../components/layout'
import Image from 'next/image'
import mainBanner from '../public/assets/images/mainBanner.png';
import router from 'next/router';
import React, {useEffect} from "react";
import { signIn, signOut, useSession } from 'next-auth/client'

export default function QA () {
    const [ session, loading ] = useSession()
    useEffect(()=>{
        console.log(session)
        if(session === undefined || session === null){
           signIn()
        }
      },[session])
  return (
    <Layout>
        <div id="outerWp">
        <div id="inter" className="qa">
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
                                <h2>文化題</h2>
                            </div>
                            <div className="globalContent">
                                <h3>823砲彈紀念碑主要紀念哪個時間點的砲戰?</h3>
                                <ul className="radio">
                                    <li>
                                        <input type="checkbox" id="radio1" name="radios" value="all" />
                                        <label htmlFor="radio1">1958年8月23日</label>
                                    </li>
                                    <li>
                                        <input type="checkbox" id="radio2" name="radios" value="all" />
                                        <label htmlFor="radio2">1985年8月8日</label>
                                    </li>
                                    <li>
                                        <input type="checkbox" id="radio3" name="radios" value="all" />
                                        <label htmlFor="radio3">1988年8月22日</label>
                                    </li>
                                    <li>
                                        <input type="checkbox" id="radio4" name="radios" value="all" />
                                        <label htmlFor="radio4">1968年8月21日</label>
                                    </li>
                                </ul>
                               <ul className="pageNum">
                                   <li><a href="">上一題</a></li>
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
                                   <li><a href="">下一題</a></li>
                               </ul>
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
