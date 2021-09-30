import Layout from '../../components/layout'
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Page () {
  return (
    <Layout>
       <div id="outerWp">
        <div id="inter" className="lottery">
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
                                <h2>摸彩頁</h2>
                            </div>
                            <div className="globalContent">
                                <h6 className="number">摸彩次數 <b>9</b></h6>
                                <ul className="input">
                                    <li><b>開始日期</b><input type="text" className="datetimepicker" /></li>
                                    <li><b>結束日期</b><input type="text" className="datetimepicker" /></li>
                                </ul>
                                <div className="name">
                                    <ul>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                    </ul>
                                </div>
                                <input type="submit" value="摸彩去" />
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