/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Layout from '../../components/layout'
import {useRouter} from 'next/router';
import React, {useEffect, useState} from "react";
import { useSession } from 'next-auth/client'
import { Button } from 'react-bootstrap';
import { shareFlag } from '../../libs/front/common';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import axios from "axios";

let ans = {};

function check() {
 var userAgentInfo=navigator.userAgent;
 var Agents =new Array("Android","iPhone","SymbianOS","Windows Phone","iPad","iPod");
 console.log(`agent : ${userAgentInfo}`)
 var flag=false;
 for(var v=0;v<Agents.length;v++) {
   if(userAgentInfo.indexOf(Agents[v])>0) {
    flag=true;
    break;
   }
  }
  return flag;
}


// const shareFlag = false;

export default function QA ({examTypeId, examTitle}) {

    const router = useRouter()
    const [ exam, setExam ] = useState(null)
    const [ examNum , setExamNum ] = useState(0)  // 題號
    const [ examAns , setExamAns ] = useState([0,0,0,0,0,0,0,0,0,0]) // 回答答案
    const [ scorePage, setScorePage ] = useState("qa");  //是否送出成績，顯示成績頁
    const [ score, setScore ] = useState();
    const [ ansList, setAnsList ] = useState([]);
    const [ cName, setCName] = useState('qa');
    const [ count, setCount] = useState(0); // 遊戲次數最多 3 次

    //console.log(session)
    const [ session, loading ] = useSession()

    useEffect(()=>{
        
        if(session === undefined || session === null || session.isAdmin){
            console.log('rediret to signin')
            router.push('/auth/signin')
        }
    },[session])

    //load 題目
    useEffect(()=>{
        axios.get(`/api/exam/random/${examTypeId}`)
        .then((res)=>
        { 
            //console.log(`examList: ${JSON.stringify(res.data.examList)}`)
            ans = {};
            const examList = res.data.examList;
            examList.map((v) => ans[v.exam_id] = 0 )
            setExam(examList)
        })
        .catch((e)=>console.log(`loadExamErr: ${e}`))
    },[])


    // 是否今日遊戲機會已用完

	useEffect(()=>{
        if(shareFlag){
            axios.get('/api/me')
            .then((res) => {
            const is_shared = res.data.is_shared;
            const countGame = res.data.count;
            setCount(countGame);
            if(!is_shared || countGame > 2){
                setScorePage('ALERT')
            }
            })
            .catch((e) => {
                console.log(`exam is_shared err: ${e}`)
            })
        }
    },[])


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
        let isMoble = check();
       
        if(shareFlag){
            
            if(isMoble){
                let data = {is_shared: true}
                axios.patch('/api/me',data);
            }
            
                FB.ui(
                    {
                        display: 'popup',
                        method: 'feed',
                        link: 'https://lyquiz.kinmen.travel/'
                    }, 
                    function(response){ 
                            if (response && !response.error_message) {
                                alert('is_shared');
                                let data = {is_shared: true}
                                axios.patch('/api/me',data)
                                .then((res) => {
                                    router.push('/#game')
                                }
                                ).catch((e)=>{
                                    console.log(`share fb err: ${e}`)
                                })
                                
                            } else {
                                alert(`Error while posting ${response}` );
                            }
                    }
                    );
        }else{
            router.push("/#game")
        }
       
    }

    const close = () => {
        router.push('/')
    }

    const QA = () => (
        <div className="inner">
            <div className="textTitle">
                <span></span>
                <span className="right"></span>
                <h2>開始遊戲</h2>
            </div>
            <div className="globalContent">
                { exam !== null ?
                (
                <>
                <h3>{`${examNum+1}. ${exam[examNum].exam_title}`}</h3>
                    <div id="videoImg" style={{margin:'0px auto'}}>
                        {exam[examNum].exam_img_url ? (<img src={`${exam[examNum].exam_img_url}`} />) : null}
                        {exam[examNum].exam_video_url ? (<div className="youtube">
                            <iframe src={exam[examNum].exam_video_url} title={exam[examNum].exam_title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>) : null}
                    </div>
                    <ul className="radio">
                        {exam[examNum].exam_option.map((v,i)=> {
                            // console.log( `${examAns[i]} : ${i+1}`)
                            // console.log( examAns[i] === i+1)
                            let fontsize = '24px';
                            if(v.length > 8){
                                fontsize = '18px'
                            } 
                            if(examAns[examNum] === i+1) {
                                return (<li key={i}><Button style={{padding:"2px", height:"55px", width:"100%",        whiteSpace: 'normal',fontSize:fontsize}} variant='danger' onClick={()=> setAns(examNum,i+1,exam[examNum].exam_id)}>{v}</Button></li>)
                            }else{
                                return (
                                    <li key={i}><Button style={{padding:"2px", height:"55px", width:"100%",whiteSpace: 'normal',fontSize:fontsize}} variant='info' onClick={()=> setAns(examNum,i+1,exam[examNum].exam_id)}>{v}</Button></li>)
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
                        {examAns.indexOf(0) < 0 ?
                        <li style={{margin:5, color:'red'}}>
                            <h6 >完成答題,如無需修正請按送出</h6>
                        </li>
                        : null
                        }
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
            <h2>你的成績</h2>
        </div>
        <div className="globalContent">
            <h6 className="number">你的分數 <b>{score}</b>分  
            {
            score >= 80 ? 
            <h4>您對烈嶼很熟悉，真棒！恭喜您獲得摸彩券一張，歡迎常來烈嶼玩，也可以上烈嶼旅遊網，觀看烈嶼介紹和最新活動資訊。</h4> 
            : 
            <h4>您似乎對烈嶼不太熟悉，分數80分以上可以獲得摸彩券一張，請再接再厲！
歡迎常來烈嶼玩，也可以上<a href="https://lieyu.kinmen.gov.tw/travel/" target="_blank" rel="noreferrer">烈嶼旅遊網</a>，觀看烈嶼介紹和最新活動資訊。</h4>
            }
            </h6>
          
            <ul className="globalCounter">
                {ansList.map((v,i)=> {
                     let fontsize = '24px';
                     if(v.exan_ans?.length > 8 || v.exam_ans_err?.length > 8){
                         fontsize = '18px'
                     } 
                    return(
                    <li key={i}>
                        <h3>{v.exam_title}</h3>
                        <ol className="radio">
                            <li className="right">
                            <Button style={{padding:"2px", height:"55px", width:"100%",whiteSpace: 'normal', fontSize:fontsize}} variant='success'>{`正解: ${v.exam_ans}`}</Button>
                            </li>
                            <li className="wrong">
                            <Button style={{padding:"2px", height:"55px", width:"100%",whiteSpace: 'normal', fontSize:fontsize}} variant='danger'>{`你的答案: ${v.exam_ans_err}`}</Button>
                            </li>
                        </ol>
                    </li>
                )}
                )}
               
            </ul>
            <ul style={{textAlign:'center',marginTop:'6px'}}>
                {count < 2 ?
                <li><Button style={{margin:"2px", height:"45px"}} variant='info' onClick={share}>分享到FB</Button>
                <Button style={{margin:"2px", height:"45px"}} variant='error' onClick={close}>結束遊戲</Button></li> 
                : <li style={{margin:5, color:'red'}}>
                    <h6 >本日遊戲次數已達3次，請於明日再玩</h6>
                 </li>
                }
            
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
            {count < 2 ?
                <h3>今日遊戲尚有{2-count}次，分享到FB可再進行遊戲<br/>
                <Button style={{margin:"2px", height:"45px"}} variant='info' onClick={share}>分享到FB</Button>
                </h3> 
            :  
            <h3>今日遊戲次數已用完，明日請早</h3> 
            }
            
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
            <img className="banImg" src={`/assets/images/bannerImg.png`} alt="gameIcn1" />
            </div>
            <audio id="music1" controls="controls" autoPlay='autoplay' hidden loop>
            <source src="/assets/music/game.m4a" type="audio/mpeg"/>
            <source src="/assets/music/game.ogg" type="audio/ogg"/>
            Your browser does not support the audio element.
            </audio>
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
    
    const examTitle = examName[params.examType]
    return {
        props: {
            examTypeId: params.examType,
            examTitle
        }
    }
}
