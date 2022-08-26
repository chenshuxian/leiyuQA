/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/link-passhref */
import { useEffect,useState } from 'react';
import Layout from '../components/layout'
import Link from "next/link"
import axios from 'axios';
import { isEqual, isAfter } from 'date-fns';

function Index () {
    const [prizeList, setPrizeList] = useState();
    const [examTypeList, setExamTypeList] = useState();
    let checkDateEnd = () => {
        let today = new Date();
        let y = today.getFullYear();
        let m = today.getMonth()+1;
        let d = today.getDate();

        let e = isEqual(new Date(2022,9,10), new Date(y,m,d));
        let a = isAfter(new Date(2022,9,10), new Date(y,m,d));
        // alert(`isEqual: ${e} isAfter: ${a}`)
        if(e || a){
            location.href='/qa/669c21ce-0505-40cd-b479-19a8b700dab5';
        }else{
            window.alert('中秋問答活動已於9/10晚上12點結束，敬請期待下次活動');
        }
    }
    useEffect(()=> {
        axios.get('/api/prize?isDelete=false')
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
                            {/* <h3 style={{color: "red"}}>本網站現為測試階段，活動尚未正式開始，實際活動時間將另行於烈嶼鄉公所臉書粉專公告，謝謝。</h3>
                            <h3>1.遊戲結合烈嶼大小事知識庫，每次遊戲10題，成績達80分（含）以上，就可獲得一張摸彩券。</h3>
                            <h3>2.遊戲結束分享至FB，將可獲得再玩一次的機會，每日最多3次遊戲機會。</h3>  */}
                            <h3>中秋佳節即將來臨，清脆的骰子聲響遍大街小巷，中秋博餅是金門的特色民俗活動，為推廣本項活動，烈嶼鄉公所自即日起至中秋節(111年9月10日)止，舉辦線上博餅知識有獎徵答活動，每次挑戰10題，每題10分，成績達80分以上，就可獲得一張摸彩券，遊戲結束公開分享至個人臉書，將可獲得再玩一次的機會，每日最多3次遊戲機會。</h3>
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
                            {/* <h3>1. 烈嶼知識庫，包含文化、觀光、戰地、建築、歷史、人文、景點等相關在地知識性題目。</h3>
                            <h3>2. 每次遊戲10題，成績達80分（含）以上，就可獲得一張摸彩券，歡迎勇闖挑戰。</h3> */}
                            <h3>博狀元餅俗稱「博餅」，以擲骰子方式進行，是盛行於閩南地區特有的民俗文化活動。相傳是出生金門洪門港(后豐港)的鄭成功營中大將洪旭，在鄭成功領軍進攻金陵時，為穩定留守廈門的官兵軍心，並撫慰思鄉情緒，發明博狀元餅遊戲，讓官兵在中秋節玩上一把，而在廈門、泉州、金門等地流傳，成為一種中秋佳節應景的民俗娛樂活動。</h3>
                            <ul className="gameUl">
                                    <Link href={`qa/669c21ce-0505-40cd-b479-19a8b700dab5`}>
                                    {/* <a onClick={()=>{checkDateEnd()}}> */}
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