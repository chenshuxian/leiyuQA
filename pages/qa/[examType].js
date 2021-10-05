/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Layout from '../../components/layout'
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from "react";
import { signIn, signOut, useSession } from 'next-auth/client'
import { Button } from 'react-bootstrap';
import Score from '../score';
const examlist = [
    {
        exam_id: 1,
        exam_title:"烈嶼受東北季風侵擾，先民為驅除風害，廣設白雞、風獅爺，希冀能庇佑鄉里。位於烈嶼西方與后宅村落之間的「北風爺」，面朝北方，其高大威武、黑面蟒袍，為鄉里鎮風止煞。請問北風爺手上的法器是什麼？",
        exam_option: ["符籙","八卦鏡","寶塔鞭","木魚"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
    {
        exam_id: 2,
        exam_title:"烈嶼受東北季風侵擾，先民為驅除風害，廣設白雞、風獅爺，希冀能庇佑鄉里。位於烈嶼西方與后宅村落之間的「北風爺」，面朝北方，其高大威武、黑面蟒袍，手持寶塔鞭，為鄉里鎮風止煞。請問北風爺相傳為何神祇的化身？",
        exam_option: ["玄天上帝","北嶽大帝","天上聖母","保生大帝"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
    {
        exam_id: 3,
        exam_title:"風獅爺通常矗立於村落入出口，以求庇佑村落不受風害之苦。少數不立於村落外的風獅爺，例如大金門瓊林蔡式家廟有尊風獅爺屬鑲於家廟牆壁裡。烈嶼也有一尊風獅爺藏於古厝牆壁中，請問這間古厝位於什麼村落？",
        exam_option: ["西方","羅厝","庵頂","上庫"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
    {
        exam_id: 4,
        exam_title:"位於上林的「李將軍廟」香火鼎盛，相傳李將軍奉旨押解欽犯流放邊疆，因不忍迫害忠良，故釋放囚犯後吞金箔鎖喉而殞，先民感佩將軍而安葬立廟。請問李將軍應為哪一朝代人士？",
        exam_option: ["西方","羅厝","庵頂","上庫"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
    {
        exam_id: 5,
        exam_title:"烈嶼歷經大小戰役，諸多古厝、洋樓等建築往往受戰火影響，輕則在牆壁留下彈孔，重則片瓦不存。請問哪間廟宇於國共對峙期間，縱使漫天砲彈，四周已成一片焦土，廟身卻受庇佑而安然無恙？",
        exam_option: ["西方","羅厝","庵頂","上庫"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
    {
        exam_id: 11,
        exam_title:"烈嶼受東北季風侵擾，先民為驅除風害，廣設白雞、風獅爺，希冀能庇佑鄉里。位於烈嶼西方與后宅村落之間的「北風爺」，面朝北方，其高大威武、黑面蟒袍，為鄉里鎮風止煞。請問北風爺手上的法器是什麼？",
        exam_option: ["符籙","八卦鏡","寶塔鞭","木魚"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
    {
        exam_id: 12,
        exam_title:"烈嶼受東北季風侵擾，先民為驅除風害，廣設白雞、風獅爺，希冀能庇佑鄉里。位於烈嶼西方與后宅村落之間的「北風爺」，面朝北方，其高大威武、黑面蟒袍，手持寶塔鞭，為鄉里鎮風止煞。請問北風爺相傳為何神祇的化身？",
        exam_option: ["玄天上帝","北嶽大帝","天上聖母","保生大帝"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
    {
        exam_id: 13,
        exam_title:"風獅爺通常矗立於村落入出口，以求庇佑村落不受風害之苦。少數不立於村落外的風獅爺，例如大金門瓊林蔡式家廟有尊風獅爺屬鑲於家廟牆壁裡。烈嶼也有一尊風獅爺藏於古厝牆壁中，請問這間古厝位於什麼村落？",
        exam_option: ["西方","羅厝","庵頂","上庫"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
    {
        exam_id: 14,
        exam_title:"位於上林的「李將軍廟」香火鼎盛，相傳李將軍奉旨押解欽犯流放邊疆，因不忍迫害忠良，故釋放囚犯後吞金箔鎖喉而殞，先民感佩將軍而安葬立廟。請問李將軍應為哪一朝代人士？",
        exam_option: ["西方","羅厝","庵頂","上庫"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
    {
        exam_id: 15,
        exam_title:"烈嶼歷經大小戰役，諸多古厝、洋樓等建築往往受戰火影響，輕則在牆壁留下彈孔，重則片瓦不存。請問哪間廟宇於國共對峙期間，縱使漫天砲彈，四周已成一片焦土，廟身卻受庇佑而安然無恙？",
        exam_option: ["西方","羅厝","庵頂","上庫"],
        exam_img_url: "/assets/images/qa/1.jpg"
    },
]

let ans = {};

export default function QA ({ qaData }) {

    const router = useRouter()
    // const {examType} = router.query
    const [ session, loading ] = useSession()
    const [ exam, setExam ] = useState(qaData)
    const [ examNum , setExamNum ] = useState(0)  // 題號
    const [ examAns , setExamAns ] = useState([0,0,0,0,0,0,0,0,0,0]) // 回答答案
    const [ scorePage, setScorePage ] = useState(false);  //是否送出成績，顯示成績頁
    const [ score, setScore ] = useState();
    const [ ansList, setAnsList ] = useState([]);
    const [ cName, setCName] = useState('qa');

    // console.log(session)
    // if(session === undefined || session === null){
    //     router.push('/auth/sigin')
    // }

    useEffect(()=>{
        if(session === undefined || session === null){
                router.push('/auth/signin')
            }
      },[session])

    useEffect(()=>{
       // console.log(`examType: ${examType}`)
       qaData.map((v) => ans[v.exam_id] = 0 )
    },[qaData])

    // 換題改變題目button顏色
    const changeQ = (i) => {
        setExamNum(i);
    }

    const upQ = (i) => {
        if(i !== 0){
            setExamNum(i-1);
        }
    }

    const nextQ = (i) => {
        if(i !== 9){
            setExamNum(i+1);
        }
    }
    // 設定答案
    const setAns = (i, a, eId) => {
        let newA = [...examAns];
        newA[i] = a;
        // console.log(newA)
        // console.log(`ansObj${eId}: ${JSON.stringify(ans)}`)
        ans[eId] = a;
        setExamAns(newA)
    }
    // 取得成績
    const getScore = () => {
        console.log(`getScore: ${JSON.stringify(ans)}`)
        setScorePage(true)
        setCName('score')
        setScore(80);
        setAnsList([
            {
                exam_title: '烈嶼受東北季風侵擾，先民為驅除風害，廣設白雞、風獅爺，希冀能庇佑鄉里。位於烈嶼西方與后宅村落之間的「北風爺」，面朝北方，其高大威武、黑面蟒袍，為鄉里鎮風止煞。請問北風爺手上的法器是什麼？',
                exam_ans: "符籙",
                exam_ans_err: "木魚"
            },
            {
                exam_title: '烈嶼受東北季風侵擾，先民為驅除風害，廣設白雞、風獅爺，希冀能庇佑鄉里。位於烈嶼西方與后宅村落之間的「北風爺」，面朝北方，其高大威武、黑面蟒袍，為鄉里鎮風止煞。請問北風爺手上的法器是什麼？',
                exam_ans: "符籙",
                exam_ans_err: "木魚"
            }
        ])

    }

    const QA = () => (
        <div className="inner">
        <div className="textTitle">
            <span></span>
            <span className="right"></span>
            <h2>文化題</h2>
        </div>
        <div className="globalContent">
            <h3>{`${examNum+1}. ${exam[examNum].exam_title}`}</h3>
            <ul className="radio">
                {exam[examNum].exam_option.map((v,i)=> {
                    // console.log( `${examAns[i]} : ${i+1}`)
                     // console.log( examAns[i] === i+1)
                    if(examAns[examNum] === i+1) {
                        return (<li key={i}><Button style={{margin:"2px", height:"55px", width:"100%"}} variant='danger' onClick={()=> setAns(examNum,i+1,exam[examNum].exam_id)}>{v}</Button></li>)
                    }else{
                        return (
                            <li key={i}><Button style={{margin:"2px", height:"55px", width:"100%"}} variant='info' onClick={()=> setAns(examNum,i+1,exam[examNum].exam_id)}>{v}</Button></li>)
                    }
                   
                })}
            </ul>
           <ul className="pageNum">
           <li><Button style={{margin:"2px", height:"40px", width:"100%"}} variant='success' onClick={()=> upQ(examNum)}> 上一題 </Button></li>
               {examAns.map((v,i) => {
                 if(examNum == i) {
                     // focus
                    return  (<li key={i}><Button style={{margin:"2px"}} variant='info' onClick={()=> changeQ(i)}> {i+1} </Button></li>)
                  } else {
                    if(v !== 0)
                      return (<li key={i}><Button style={{margin:"2px"}} variant='danger' onClick={()=> changeQ(i)}> {i+1} </Button></li>)
                    else
                      return (<li key={i}><Button style={{margin:"2px"}} variant='success' onClick={()=>changeQ(i)}> {i+1} </Button></li>)
                  }
                }
               )}
               <li><Button style={{margin:"2px", height:"40px", width:"100%"}} variant='success' onClick={()=> nextQ(examNum)}> 下一題 </Button></li>
           </ul>
           <ul style={{textAlign:'center',marginTop:'6px'}}>
               <li>
                   <Button variant="info" onClick={()=>getScore()}>送出</Button>
               </li>
           </ul>
        </div>
    </div>
    )

    const SCORE = () => (
        <div className="inner">
        <div className="textTitle">
            <span></span>
            <span className="right"></span>
            <h2>你的成積</h2>
        </div>
        <div className="globalContent">
            <h6 className="number">你的分數 <b>{score}</b>分</h6>
            <ul className="globalCounter">
                {ansList.map((v,i)=> (
                    <li key={i}>
                        <h3>{v.exam_title}</h3>
                        <ol className="radio">
                            <li className="right">
                            <Button style={{margin:"2px", height:"45px", width:"100%"}} variant='success'>{v.exam_ans}</Button>
                            </li>
                            <li className="wrong">
                            <Button style={{margin:"2px", height:"45px", width:"100%"}} variant='danger'>{v.exam_ans_err}</Button>
                            </li>
                        </ol>
                    </li>
                ))}
               
            </ul>
            <ul style={{textAlign:'center',marginTop:'6px'}}>
                <li> <Button variant="info" onClick={()=>getScore()}>分享後可再玩一次</Button></li>
            </ul>
        </div>
    </div>
    )

    
    
  return (
    <Layout>
        <div id="outerWp">
        <div id="inter" className={cName}>
            <div id="banner">
            <Image src={mainBanner} alt="mainBanner" class="banImg" />
            </div>
            <div id="contentWp">
                <dl id="main">
                    <dd>
                        {
                            scorePage ? <SCORE/> : <QA />
                        }
                    </dd>
                </dl>
            </div>
        </div>
    </div>
    </Layout>
  )
}

export async function getStaticPaths() {
    // Return a list of possible value for id
    const examType = ['1','2','3'];

    const paths = examType.map((v,i) => ({
        params: { examType: v },
      }))

    return {
        paths,
        fallback: false
    }
}
  
export async function getStaticProps({ params }) {
// Fetch necessary data for the blog post using params.id
console.log(params.examType)
    const qaData = examlist
    return {
        props: {
            qaData
        }
    }
}