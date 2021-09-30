import Layout from '../components/layout'
import Image from 'next/image'
import mainBanner from '../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Page () {
  return (
    <Layout>
     <div id="outerWp">
        <div id="inter" className="score">
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
                                <h2>你的成積</h2>
                            </div>
                            <div className="globalContent">
                                <h6 className="number">你的分數 <b>90</b>分</h6>
                                <ul className="globalCounter">
                                    <li>
                                        <h3>823砲彈紀念碑主要紀念哪個時間點的砲戰?</h3>
                                        <ol className="radio">
                                            <li className="right">
                                                <input type="checkbox" id="radio1" name="radios" value="all" />
                                                <label htmlFor="radio1">1958年8月23日</label>
                                            </li>
                                            <li className="wrong">
                                                <input type="checkbox" id="radio2" name="radios" value="all" />
                                                <label htmlFor="radio2">1985年8月8日</label>
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h3>823砲彈紀念碑主要紀念哪個時間點的砲戰?</h3>
                                        <ol className="radio">
                                            <li>
                                                <input type="checkbox" id="radio1" name="radios" value="all" />
                                                <label htmlFor="radio1">1958年8月23日</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="radio2" name="radios" value="all" />
                                                <label htmlFor="radio2">1985年8月8日</label>
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h3>823砲彈紀念碑主要紀念哪個時間點的砲戰?</h3>
                                        <ol className="radio">
                                            <li>
                                                <input type="checkbox" id="radio1" name="radios" value="all" />
                                                <label htmlFor="radio1">1958年8月23日</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="radio2" name="radios" value="all" />
                                                <label htmlFor="radio2">1985年8月8日</label>
                                            </li>
                                        </ol>
                                    </li>
                                </ul>
                                <ul className="button">
                                    <li><input type="button" value="分享" /></li>
                                    <li><input type="button" value="再玩一次" /></li>
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