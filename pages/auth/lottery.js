import Layout from '../../components/layout'
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import { Form,DropdownButton, Dropdown, Container, Row, Col, Button } from 'react-bootstrap';
import "../../node_modules/react-datepicker/dist/react-datepicker.min.css"
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import zh_TW  from '../../node_modules/date-fns/locale/zh-TW'
registerLocale('TW', zh_TW);

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


function Lottery ({ prizeList, prizeObj }) {
    const date = new Date()
    const [startDate, setStartDate] = useState(date)
    const [endDate, setEndDate] =useState(date)
    const [dropTitle, setDropTitle] = useState('獎品清單')

    const prizeSelect = (v) => {
      setDropTitle(prizeObj[v])
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
                                <Container className="lottery">
                                    <Row>
                                      <Col xs={12} md={3}>
                                      <Row> 
                                            <div className="lable">
                                            獎品清單:
                                            </div>
                                      <DropdownButton
                                        title={dropTitle}
                                        id="dropdown-menu-align-right"
                                        onSelect={prizeSelect}
                                          >
                                            {prizeList.map((v,i) => (
                                              <div key={i}>
                                              <Dropdown.Item eventKey={v.prize_id}>{v.prize_name}</Dropdown.Item>
                                              </div>
                                            ))}
                                        </DropdownButton>
          
                                        </Row>
                                      </Col>
                                      <Col xs={12} md={3}>
                                
                                          <div className="lable">
                                          開始日期:
                                          </div>
                                          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}
                                            locale="TW"
                                            withPortal
                                            portalId="root-portal"
                                            dateFormat="yyyy/MM"
                                            showMonthYearPicker   />
                                        
                                      </Col>
                                      <Col xs={12} md={3}>
                                        <Row> 
                                          <div className="lable">
                                          結束日期:
                                          </div>
                                            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)}
                                              locale="TW"
                                              withPortal
                                              portalId="root-portal"
                                              dateFormat="yyyy/MM"
                                              showMonthYearPicker
                                                 />
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={3}>
                                          <Row> 
                                            <div className="lable">
                                            抽獎數量:
                                            </div>
                                            <Form.Control width="2" value="1" />
                                            </Row>
                                        </Col>
                                    </Row>
                                </Container>
                                {/* <h6 className="number"><DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />摸彩次數 <b>9</b></h6> */}
                                
                                {/* <ul className="input">
                                    <li><b>結束日期</b><input type="text" className="datetimepicker" /></li>
                                </ul>
                                <div className="name">
                                    <ul>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                        <li>陳小東</li>
                                    </ul>
                                </div> 
  <input type="submit" value="摸彩去" /> */}
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
          prize_name:true
      }
  })

  const prizeObj = prizeList.reduce((obj, cur) => ({...obj, [cur.prize_id]: cur.prize_name}), {})

  return {
    props: {
        prizeList,
        prizeObj
    }, // will be passed to the page component as props
  }
}

export default Lottery;