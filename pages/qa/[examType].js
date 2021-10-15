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

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import axios from "axios";
import https from "https";

let ans = {};

export default function QA ({examTypeId, examTitle}) {

    const router = useRouter()
    const {examType} = router.query
    const [ session, loading ] = useSession()
    const [ exam, setExam ] = useState(null)
    const [ examNum , setExamNum ] = useState(0)  // 題號
    const [ examAns , setExamAns ] = useState([0,0,0,0,0,0,0,0,0,0]) // 回答答案
    const [ scorePage, setScorePage ] = useState("qa");  //是否送出成績，顯示成績頁
    const [ score, setScore ] = useState();
    const [ ansList, setAnsList ] = useState([]);
    const [ cName, setCName] = useState('qa');

    //console.log(session)
    

    useEffect(()=>{
        if(session === undefined || session === null){
            console.log('rediret to signin')
            router.push('/auth/signin')
        }else{
            // const agent = new https.Agent({  
            //     rejectUnauthorized: false
            //   });
            axios.get(`/api/exam/random/${examTypeId}`)
            .then((res)=>
            { 
                //console.log(`examList: ${JSON.stringify(res.data.examList)}`)
                const examList = res.data.examList;
                examList.map((v) => ans[v.exam_id] = 0 )
                setExam(examList)
            })
            .catch((e)=>console.log(`loadExamErr: ${e}`))
        }
    },[])

    // 是否今日遊戲機會已用完
    useEffect(()=>{
        if(false){
          setScorePage("ALERT")
        }
      })

    // useEffect(()=>{
    //    // console.log(`examType: ${examType}`)
    //    qaData.map((v) => ans[v.exam_id] = 0 )
    // },[qaData])

    // 換題改變題目button顏色
    const changeQ = (i) => {
        setExamNum(i);
    }

    const upQ = (i) => {
        console.log(i)
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
        // console.log(`ansObj${eId}: ${JSON.stringify(a)}`)
        ans[eId] = a;
        setExamAns(newA)
        nextQ(i);
    }
    // 取得成績
    const getScore = () => {
        //console.log(`getScore: ${JSON.stringify(ans)}`)
        const data = ans;
        axios.post('/api/exam/submitAnswer',data)
        .then((res)=>{
            const data = res.data;
            setScorePage("score")
            setCName("score")
            setScore(data.score);
            setAnsList(data.ansList);
        })
        .catch((e)=>{
            console.log(`getAnswerErr: ${e}`)
        })
        

    }

    const share = () => {
        // 分享到fb 取得在玩一次的機會
        //router.push("/#game")
        FB.ui({
            display: 'popup',
            method: 'feed',
            link: 'https://lieyu.fantasyball.tw/'
          }, function(response){ 
              if (response && !response.error_message) {
                    router.push('/#game')
                } else {
                    alert('Error while posting.11');
                }
            });
    }

    const QA = () => (
        <div className="inner">
            <div className="textTitle">
                <span></span>
                <span className="right"></span>
                <h2>{examTitle}</h2>
            </div>
            <div className="globalContent">
                { exam !== null ?
                (
                <>
                <h3>{`${examNum+1}. ${exam[examNum].exam_title}`}</h3>
                    <div id="videoImg">
                        {exam[examNum].exam_img_url ? (<img src={`/assets/images/${exam[examNum].exam_img_url}`} />) : null}
                        {exam[examNum].exam_video_url ? (<div className="youtube">
                            <iframe src={exam[examNum].exam_video_url} title={exam[examNum].exam_title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>) : null}
                        {/* <div className="youtube">
                            <iframe src="https://www.youtube.com/embed/9agxjqRAZYU" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div> */}
                    </div>
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
                    </>
                 ): null}
                </div>
        </div>
    )

    // 成績頁面
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
            <li><Button style={{margin:"2px", height:"45px", width:"90px"}} variant='info' onClick={share}>分享</Button></li> 
            </ul>
        </div>
    </div>
    )

     // 警告提示頁面
     const ALERT = () => (
        <div className="inner">
        <div className="textTitle">
            <span></span>
            <span className="right"></span>
            <h2>提示</h2>
        </div>
        <div className="globalContent">
            <h3>今日遊戲次數已用完，明日請早</h3>
        </div>
    </div>
    )

    const page = (name) => {
        if(name == "qa") {
            return (<QA />)
        }else if(name == "score") {
            return (<SCORE />)
        }else {
            return (<ALERT />)
        }
    }
     
    
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
                        {page(scorePage)}
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
    const examType = await prisma.exam_type.findMany({select:{exam_type_id:true}})
    console.log(`examType: ${JSON.stringify(examType)}`)
    const paths = examType.map((v,i) => ({
        params: { examType: v.exam_type_id },
      }))

    return {
        paths,
        fallback: false
    }
}
  
export async function getStaticProps({params}) {
// Fetch necessary data for the blog post using params.id
// console.log(params.examType)
    const examTypeList = await prisma.exam_type.findMany()
    const examName = examTypeList.reduce((obj, cur) => ({...obj, [cur.exam_type_id]: cur.exam_type_name}), {})

    console.log(`examName: ${JSON.stringify(examName)}`)
    
    // const examNameObj = { 
    //     "4034bd78-17c8-4919-93d5-d0f547a0401b" : "圖書",
    //     "2b5ecce2-df3b-4a8c-9a00-17f52c71b15b" : "文化",
    //     "669c21ce-0505-40cd-b479-19a8b700dab5" : "綜合",
    // }
    const examTitle = examName[params.examType]
    return {
        props: {
            examTypeId: params.examType,
            examTitle
        }
    }
}