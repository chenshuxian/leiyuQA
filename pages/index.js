/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/link-passhref */
import { useEffect,useState } from 'react';
import Layout from '../components/layout'
import Image from 'next/image'
import bannerImg from '../public/assets/images/bannerImg.png';
import Link from "next/link"
import axios from 'axios';

function Index () {
    const [prizeList, setPrizeList] = useState();
    const [examTypeList, setExamTypeList] = useState();
    useEffect(()=> {
        axios.get('/api/prize')
        .then((res) => {
            setPrizeList(res.data.prizeList)
        })
        .catch((e) =>  console.log(`index get prize err: ${e}`))
    },[])
    // useEffect(()=> {
    //     axios.get('/api/examType')
    //     .then((res) => {
    //         setExamTypeList(res.data.examTypeList)
    //     })
    //     .catch((e) =>  console.log(`index get prize err: ${e}`))
    // },[])
  return (
    <Layout>
      <div id="outerWp">
        <div id="banner">
        <img className="banImg" src={`/assets/images/bannerImg.png`} alt="gameIcn1" />
        </div>
        <div id="content" className="indexPage">
            <dl id="main">
                <dd id="evenInfo" className="section">
                    <div className="inner">
                        <div className="textTitle">
                            <span></span>
                            <span className="right"></span>
                            <h2>活動說明</h2>
                        </div>
                        <div className="globalContent" style={{marginBottom:2}}>
                            <h3>1.遊戲結合烈嶼大小事知識庫，每次遊戲10題，成績達80分（含）以上，就可獲得一張摸彩券。</h3>
                            <h3>2.遊戲結束分享至FB，將可獲得再玩一次的機會，每日每次最多3次遊戲機會。</h3> 
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
                            <h3>1. 烈嶼知識庫，包含文化、觀光、戰地、建築、歷史、人文、景點等相關在地知識性題目。</h3>
                            <h3>2. 每次遊戲10題，成績達80分（含）以上，就可獲得一張摸彩券，歡迎勇闖挑戰。</h3>
                            <ul className="gameUl">
                                    <Link href={`qa/669c21ce-0505-40cd-b479-19a8b700dab5`}>
                                        <li style={{ display: 'table', margin: '0 auto'}}>
                                            <img src={`/assets/images/gameIcn3.png`} />
                                            <div className="qaTitle"><h4>開始遊戲</h4></div>
                                        </li>
                                    </Link>
                                {/* {Array.isArray(examTypeList) && examTypeList.map((v,i) => (
                                    <Link key={`examType${i}`} href={`qa/${v.exam_type_id}`}>
                                    <li >
                                        <img src={`/assets/images/gameIcn${i+1}.png`} />
                                        <div className="qaTitle"><h4>{v.exam_type_name}</h4></div>
                                    </li>
                                    </Link>
                                ))} */}
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
                                    <img src={v.prize_image_url} />
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

// export async function getStaticProps(context) {

//     const examType = await prisma.exam_type.findMany({
//         where:{
//             is_delete: false
//         }, 
//         select:{
//             exam_type_id:true,
//             exam_type_name:true
//         }
//     })
//     //console.log(`examType : ${JSON.stringify(examType)}`)
//     // const prizeData = await prisma.prize.findMany({
//     //     select:{
//     //         prize_name:true,
//     //         prize_image_url:true,
//     //         prize_title:true
//     //     }
//     // })

//     return {
//       props: {
//           examType
//       }, // will be passed to the page component as props
//     }
// }

export default Index;