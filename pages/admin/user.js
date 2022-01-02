/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import react, {useEffect, useState} from 'react'
import Layout from '../../components/adminLayout'
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory,{ selectFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import "../../node_modules/react-datepicker/dist/react-datepicker.min.css"
import Login from "./login"
import { getList } from '../../libs/front/user';


function User () {

    const [ session, loading ] = useSession();
    const [list, setList] = useState([]);

    useEffect(()=>{
        getList(setList)
    },[]) 

    if(!session){
        return <Login />
    }


    const columns = [
        {
            dataField: 'id',
            text:'用戶編碼',
        }, 
        {
            dataField: 'name',
            text: '姓名',
            searchable: true
        },
        {
            dataField: 'phone',
            text: '手機',
        },
        {
            dataField: 'addr',
            text: '地址',
        }, 
        {
            dataField: '_count.ticket',
            text: '抽獎卷數量',
        }, 
        {
            dataField: 'last_play_time',
            text: '最後遊戲時間',
        }, 
       ];

   

  return (
    <Layout>
       <div id="outerWp">
        <div id="inter" className="userProfile">
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
                                <h2>會員帳號管理</h2>
                            </div>
                            <div className="globalContent"> 
                            <ToolkitProvider
                                keyField='id'
                                data={ list }
                                columns= {columns}
                                bordered={ true }
                                noDataIndication="沒有任何會員帳號"
                            >
                                {
                                props => (
                                    <div style={{zIndex:2, position:'relative'}}>
                                    <h3>會員員帳號</h3>
                                    <hr />
                                    <BootstrapTable
                                        { ...props.baseProps }
                                        pagination={ paginationFactory({showTotal:true}) }
                                        filter={ filterFactory() }
                                    />
                                    </div>
                                )
                                }
                            </ToolkitProvider>
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

export default User;