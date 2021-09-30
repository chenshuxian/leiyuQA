/* eslint-disable @next/next/link-passhref */
import Layout from '../components/layout'
import Image from 'next/image'
import gameIcn1 from '../public/assets/images/gameIcn1.png';
import gameIcn2 from '../public/assets/images/gameIcn2.png';
import gameIcn3 from '../public/assets/images/gameIcn3.png';
import bannerImg from '../public/assets/images/bannerImg.png';
import gift1 from '../public/assets/images/gift1.png';
import Link from "next/link"


export default function Page () {
  return (
    <Layout>
      <div id="outerWp">
        <div id="banner">
        <Image className="banImg" src={bannerImg} alt="gameIcn1" />
        </div>
        <div id="contentWp">
            <dl id="main">
                <dd id="game" className="section">
                    <div className="inner">
                        <div className="textTitle">
                            <span></span>
                            <span className="right"></span>
                            <h2>開始遊戲</h2>
                        </div>
                        <div className="globalContent">
                            <h3>共地質、文化、綜合三大題庫，每題庫共10題問題，答對成績答80分，就可取得一張摸彩卷</h3>
                            <ul>
                                <li>
                                <Image src={gameIcn1} alt="gameIcn1" />
                                    <Link href="qa">
                                        <div className="qaTitle"><h4>人文</h4></div>
                                    </Link>
                                </li>
                                <li>
                                <Image src={gameIcn2} alt="gameIcn2" />
                                    <Link href="qa">
                                    
                                        <div className="qaTitle"><h4>文化</h4></div>
                                    </Link>
                                </li>
                                <li>
                                <Image src={gameIcn3} alt="gameIcn3" />
                                    <Link href="qa">
                                        <div className="qaTitle"><h4>綜合</h4></div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </dd>
                <dd id="gift" className="section">
                    <div className="inner">
                        <div className="textTitle">
                            <span></span>
                            <span className="right"></span>
                            <h2>活動獎品</h2>
                        </div>
                        <div className="globalContent">
                            <ul>
                                <li>
                                    <span>頭獎</span>
                                    <Image src={gift1} alt="gameIcn1" />
                                    <h4>iPad</h4>
                                </li>
                                <li>
                                    <span>二獎</span>
                                    <Image src={gift1} alt="gameIcn1" />
                                    <h4>Switch</h4>
                                </li>
                                <li>
                                    <span>三獎</span>
                                    <Image src={gift1} alt="gameIcn1" />
                                    <h4>馬克杯</h4>
                                </li>
                                <li>
                                    <span>四獎</span>
                                    <Image src={gift1} alt="gameIcn1" />
                                    <h4>明信片</h4>
                                </li>
                                <li>
                                    <span>五獎</span>
                                    <Image src={gift1} alt="gameIcn1" />
                                    <h4>高梁酒</h4>
                                </li>
                                <li>
                                    <span>六獎</span>
                                    <Image src={gift1} alt="gameIcn1" />
                                    <h4>鋼筆</h4>
                                </li>
                            </ul>
                        </div>
                    </div>
                </dd>
                <dd id="evenInfo" className="section">
                    <div className="inner">
                        <div className="textTitle">
                            <span></span>
                            <span className="right"></span>
                            <h2>活動說明</h2>
                        </div>
                        <div className="globalContent">
                            <h3>共地質、文化、綜合三大題庫，每題庫共10題問題，答對成績答80分，就可取得一張摸彩卷</h3>
                        </div>
                    </div>
                </dd>
            </dl>
        </div>
    </div>
    </Layout>
  )
}