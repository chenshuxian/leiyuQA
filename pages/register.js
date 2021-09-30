import Layout from '../components/layout'
import Image from 'next/image'
import mainBanner from '../public/assets/images/mainBanner.png';

export default function Page () {
  return (
    <Layout>
      <div id="outerWp">
        <div id="inter" className="loginForm">
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
                                <h2>會員資訊</h2>
                            </div>
                            <div className="globalContent">
                                <h3>
                                    請確實填資料<br />
                                    此為您登入之帳號，得獎時將以您所填之資料與您聯繫，
                                </h3>
                                <ul className="input">
                                    <li><b>姓名</b><input type="text" /></li>
                                    <li><b>手機</b><input type="text" /></li>
                                    <li><b>地址</b><input type="text" /></li>
                                </ul>
                                <input type="submit" value="確認送出" />
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