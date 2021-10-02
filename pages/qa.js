/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Layout from '../components/layout'
import Image from 'next/image'
import mainBanner from '../public/assets/images/mainBanner.png';
import router from 'next/router';
import React, {useEffect, useState} from "react";
import { signIn, signOut, useSession } from 'next-auth/client'

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
]

export default function QA () {
    const [ session, loading ] = useSession()
    const [ exam, setExam ] = useState(examlist)
    const [ examNum , setExamNum ] = useState(0)  // 題號
    const [ examAns , setExamAns ] = useState([0,0,0,0,0,0,0,0,0,0]) // 回答答案

    // console.log(session)
    if(session === undefined || session === null){
        signIn()
    }
   
  return (
    <Layout>
        <div id="outerWp">
        <div id="inter" className="qa">
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
                                <h2>文化題</h2>
                            </div>
                            <div className="globalContent">
                                <h3>{exam[examNum].exam_title}</h3>
                                <ul className="radio">
                                    {exam[examNum].exam_option.map((v,i)=> {
                                        return (
                                            <li key={i}>
                                                <input type="checkbox" id={`radio${i}`} name="radios" value="all" />
                                                <label htmlFor={`radio${i}`}>{v}</label>
                                            </li>
                                        )
                                    })}
                                </ul>
                               <ul className="pageNum">
                                   <li><a href="">上一題</a></li>
                                   {examAns.map((v,i) => (
                                       <li key={i}><Button></Button></li>
                                   ))}
                                   {/* <li><a href="" className="active">1</a></li>
                                   <li><a >2</a></li>
                                   <li><a >3</a></li>
                                   <li><a href="">4</a></li>
                                   <li><a href="">5</a></li>
                                   <li><a href="">6</a></li>
                                   <li><a href="">7</a></li>
                                   <li><a href="">8</a></li>
                                   <li><a href="">9</a></li>
                                   <li><a href="">10</a></li> */}
                                   <li><a href="">下一題</a></li>
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
