/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import react, {useEffect} from 'react'
import router from 'next/router';
import Layout from '../../components/adminLayout'
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import { Form, DropdownButton, Dropdown, Container, Row, Col, Button } from 'react-bootstrap';
import "../../node_modules/react-datepicker/dist/react-datepicker.min.css"
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { getList } from '../../libs/front/user';
import { getDrawer } from '../../libs/front/drawer';

import zh_TW  from 'date-fns'
registerLocale('TW', zh_TW);

import { PrismaClient } from '@prisma/client'
import axios from 'axios';
const prisma = new PrismaClient()

function Lottery ({ prizeList, prizeObj }) {
    const date = new Date()
    const randTime = 1000
    const lotteryList = ['陳書賢','吳書賢','吳小賢','的書賢','二小賢','吳臣賢','吳小靈']
    const [startDate, setStartDate] = useState(date)
    const [endDate, setEndDate] =useState(date)
    const [prizeId, setPrizeId] = useState(Object.keys(prizeObj)[0])
    const [luckyName, setLuckyName] = useState("準備中")
    const [ session, loading ] = useSession()
    const [drawList, setDrawList] = useState([])

    
    useEffect(()=>{
    
      if(session){
        if(!session.isAdmin){
          router.push("/admin/login")
        }
      }else{
        router.push("/admin/login")
      }
      
    },[session])

    useEffect(()=>{
      getList(setDrawList);
    },[])


    const prizeSelect = (e) => {
      console.log(e.target.value)
      //setDropTitle(prizeObj[e.target.value])
      setPrizeId(e.target.value)
    }

    const luckyList = async () => {
      let num = document.getElementById('drawNum').value
      let drawData = {
        number : parseInt(num),
        prize_id : prizeId
      };

      let draw = await getDrawer(drawData);
      const winList = draw.data.winnerList;
      const total = draw.data.total
      let listStr = '';

      if(total > 0 ) {

      }
    }

    const drawer = async () => {

      const randomName = async () => {
        let len = drawList.length;
        let luckyNum = Math.floor(Math.random() * len)
        setLuckyName(drawList[luckyNum].name)
      }

      let timeoutID = setInterval(() => { randomName()},100)
      let luckyMan = await luckyList();
      
      setTimeout(async ()=>{
        setLuckyName(luckyMan)
        clearInterval(timeoutID)
      },randTime)
    }

  return (
    <Layout>
       <div id="outerWp">
        <div id="inter" className="lottery">
            <div id="banner">
            <Image src={mainBanner} alt="mainBanner" className="banImg" />
            </div>
            <div id="contentWp">
                <dl id="main">
                    <dd>
                        <div className="inner">
                            <div className="textTitle">
                                <span></span>
                                <span className="right"></span>
                                <h2>摸彩頁</h2>
                            </div>
                            <div className="globalContent"> 
                              <Form inline style={{justifyContent:"space-around"}}>
                                <Form.Row xs={12} md={3}>
                                  <Form.Group as={Col}  controlId="prizeList">
                                    <Form.Label>獎品清單: </Form.Label>
                                    <Form.Control as="select" onChange={prizeSelect} defaultValue={prizeId}>
                                      {prizeList.map((v,i) => (
                                          <option key={`prizeList${i}`} value={v.prize_id}>{v.prize_name}</option>
                                      ))}
                                    </Form.Control>
                                  </Form.Group>
                                </Form.Row>
                                {/* <Form.Row xs={12} md={3}>
                                  <Form.Group as={Col}  controlId="startDate">
                                    <Form.Label>開始日期: </Form.Label>
                                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}
                                            locale="TW"
                                            withPortal
                                            portalId="root-portal"
                                            dateFormat="yyyy/MM"
                                            showMonthYearPicker   />
                                  </Form.Group>
                                </Form.Row>
                                <Form.Row xs={12} md={3}>
                                  <Form.Group as={Col}  controlId="endDate">
                                    <Form.Label>結束日期: </Form.Label>
                                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)}
                                              locale="TW"
                                              withPortal
                                              portalId="root-portal"
                                              dateFormat="yyyy/MM"
                                              showMonthYearPicker
                                                 />
                                  </Form.Group>
                                </Form.Row> */}
                                <Form.Row xs={12} md={3}>
                                  <Form.Group as={Col}  controlId="endDate">
                                    <Form.Label>抽獎人數: </Form.Label>
                                    <Form.Control type="text" id='drawNum' defaultValue="1"></Form.Control>
                                  </Form.Group>
                                </Form.Row>
                              </Form>
                              <h6 className="number" style={{borderBottom: "4px solid #d8d8d8"}}></h6>
                              <Container>
                                  <Row style={{justifyContent:"center",alignItems:"center",textAlign:"center"}}>
                                    <Col xs={12} md={6} >
                                      <img src={`/assets/images/${prizeObj[prizeId]}`} className="lotteryImg" />
                                    </Col>
                                    <Col xs={12} md={6} >
                                        <h1>{luckyName}</h1>
                                    </Col>
                                  </Row>
                                  <Row style={{justifyContent:"center",alignItems:"center",textAlign:"center"}}>
                                    <Button style={{width:"50%", borderRadius:'5px'}} onClick={drawer}>摸彩</Button>
                                  </Row>
                              </Container>
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

export async function getStaticProps(context) {

  const prizeList = await prisma.prize.findMany({
      select:{
          prize_id:true,
          prize_name:true,
          prize_image_url:true
      }
  })

  const prizeObj = prizeList.reduce((obj, cur) => ({...obj, [cur.prize_id]: cur.prize_image_url}), {})

  return {
    props: {
        prizeList,
        prizeObj
    }, // will be passed to the page component as props
  }
}

export default Lottery;