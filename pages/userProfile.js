import Layout from '../components/layout'
import Image from 'next/image'
import mainBanner from '../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Page () {
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
                                    <li><b>姓名</b><input type="text" /></li>
                                    <li><b>電話</b><input type="text" /></li>
                                    <li><b>地址</b><input type="text" /></li>
                                    <li><input type="submit" value="修改" /></li>
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
                                <ul className="pageNum">
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