/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/link-passhref */
import Layout from '../components/layout'
import Image from 'next/image'
import bannerImg from '../public/assets/images/bannerImg.png';
import Link from "next/link"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const PRIZEURL = '/assets/images';

function Index ( { prizeData, examType }) {
  return (
    <Layout>
      <div id="outerWp">
        <div id="banner">
        <Image className="banImg" src={bannerImg} alt="gameIcn1" />
        </div>
        <div id="contentWp">
            <dl id="main">
                <dd id="evenInfo" className="section">
                    <div className="inner">
                        <div className="textTitle">
                            <span></span>
                            <span className="right"></span>
                            <h2>活動說明</h2>
                        </div>
                        <div className="globalContent" style={{marginBottom:2}}>
                            <h3>每日有一次遊戲機會，遊戲結束點擊分享鈕，將可獲得再玩一次的機會</h3>
                            <h3>題目由地質、文化、綜合三大題庫，每題庫共10題問題，答對成績答80分，就可取得一張摸彩卷</h3> 
                        </div>
                    </div>
                </dd>
                <dd id="game" className="section">
                    <div className="inner">
                        <div className="textTitle">
                            <span></span>
                            <span className="right"></span>
                            <h2>開始遊戲</h2>
                        </div>
                        <div className="globalContent">
                            <h3>文化、圖書、綜合三大題庫，每題庫共10題問題，答對成績答80分，就可取得一張摸彩卷</h3>
                            <ul>
                                {examType.map((v,i) => (
                                    <li key={`examType${i}`}>
                                        <img src={`/assets/images/gameIcn${i+1}.png`} />
                                        <Link href={`qa/${v.exam_type_id}`}>
                                            <div className="qaTitle"><h4>{v.exam_type_name}</h4></div>
                                        </Link>
                                    </li>
                                ))}
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
                                {prizeData.map((v,i) => (
                                    <li key={`prize${i}`}>
                                    <span>{v.prize_title}</span>
                                    <img src={PRIZEURL+v.prize_image_url} />
                                    <h4>{v.prize_name}</h4>
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </dd>
            </dl>
        </div>
    </div>
    </Layout>
  )
}

export async function getStaticProps(context) {

    const examType = await prisma.exam_type.findMany({
        select:{
            exam_type_id:true,
            exam_type_name:true
        }
    })
    //console.log(`examType : ${JSON.stringify(examType)}`)
    const prizeData = await prisma.prize.findMany({
        select:{
            prize_name:true,
            prize_image_url:true,
            prize_title:true
        }
    })

    return {
      props: {
          prizeData,
          examType
      }, // will be passed to the page component as props
    }
}

export default Index;