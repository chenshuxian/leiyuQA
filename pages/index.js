/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/link-passhref */
import { useEffect,useState } from 'react';
import Layout from '../components/layout'
import Image from 'next/image'
import bannerImg from '../public/assets/images/bannerImg.png';
import Link from "next/link"
import { PrismaClient } from '@prisma/client'
import axios from 'axios';
const prisma = new PrismaClient()
const PRIZEURL = '/assets/images/';

function Index ( { examType }) {
    const [prizeList, setPrizeList] = useState();
    useEffect(()=> {
        axios.get('/api/prize')
        .then((res) => {
            setPrizeList(res.data.prizeList)
        })
        .catch((e) =>  console.log(`index get prize err: ${e}`))
    },[])
  return (
    <Layout>
      <div id="outerWp">
        <div id="banner">
        <Image className="banImg" src={bannerImg} alt="gameIcn1" />
        </div>
        <div id="contentWp" className="indexPage">
            <dl id="main">
                <dd id="evenInfo" className="section">
                    <div className="inner">
                        <div className="textTitle">
                            <span></span>
                            <span className="right"></span>
                            <h2>活動說明</h2>
                        </div>
                        <div className="globalContent" style={{marginBottom:2}}>
                            <h3>每日最多3次遊戲機會，遊戲結束分享至FB，將可獲得再玩一次的機會</h3>
                            <h3>題目分為文化、圖書、綜合三大題庫，每次試卷10題，成績達80分，就可獲得一張摸彩卷</h3> 
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
                            <h3>文化、圖書、綜合三大題庫，每次試卷10題，成績達80分，就可獲得一張摸彩卷</h3>
                            <ul className="gameUl">
                                {examType.map((v,i) => (
                                    <Link key={`examType${i}`} href={`qa/${v.exam_type_id}`}>
                                    <li >
                                        <img src={`/assets/images/gameIcn${i+1}.png`} />
                                        <div className="qaTitle"><h4>{v.exam_type_name}</h4></div>
                                    </li>
                                    </Link>
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
                                {Array.isArray(prizeList) && prizeList.map((v,i) => (
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
        where:{
            is_delete: false
        }, 
        select:{
            exam_type_id:true,
            exam_type_name:true
        }
    })
    //console.log(`examType : ${JSON.stringify(examType)}`)
    // const prizeData = await prisma.prize.findMany({
    //     select:{
    //         prize_name:true,
    //         prize_image_url:true,
    //         prize_title:true
    //     }
    // })

    return {
      props: {
          examType
      }, // will be passed to the page component as props
    }
}

export default Index;