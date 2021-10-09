import Layout from '../../components/layout'
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import { FormGroup,ControlLabel, Container, Row, Col, Button } from 'react-bootstrap';
import "../../node_modules/react-datepicker/dist/react-datepicker.min.css"
import styles from "./lottery.module.css"

export default function Lottery () {
    const date = new Date()
    const [startDate, setStartDate] = useState(date)
    const [endDate, setEndDate] =useState(date)

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
                                <Container>
                                    <Row>
                                        <Col>
                                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} 
                                         popperClassName="some-custom-class"
                                         popperPlacement="bottom-end"
                                         popperModifiers={[
                                           {
                                             name: "offset",
                                             options: {
                                               offset: [5, 10],
                                             },
                                           },
                                           {
                                             name: "preventOverflow",
                                             options: {
                                               rootBoundary: "viewport",
                                               tether: true,
                                               altAxis: false,
                                             },
                                           },
                                         ]}
                                        />
                                        </Col>
                                        <Col>
                                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                                        </Col>
                                    </Row>
                                    <Row>
                                    </Row>
                                    <Row>
                                        <Col>
                                        <Button style={{backgroundColor:'red',zIndex:'-1'}}>摸彩去</Button>
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