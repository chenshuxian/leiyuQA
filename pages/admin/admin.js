/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import react, {useEffect, useState} from 'react'
import Layout from '../../components/adminLayout'
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory,{ selectFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import "../../node_modules/react-datepicker/dist/react-datepicker.min.css"
import Login from "./login"
import ExamAdminModal from '../../components/examAdminModal'
import { getList, singleDel, updateData, addData } from '../../libs/front/member';
import { getFormData } from '../../libs/front/common';
import { v4 as uuidv4 } from 'uuid';
import router from 'next/router';


function Admin () {
    const rows = [
        {id:'password3','value':'','text':'','type':'password','placeholder':'密碼請由8位數的英數字組成', hidden:true},
      {id:'name','value':'','text':'帳號','type':'','placeholder':'', required:true},
      {id:'password','value':'','text':'密碼','type':'password','placeholder':'密碼請由8位數的英數字組成', required:true},
    ] 

    const updateRows = [
        {id:'password3','value':'','text':'','type':'password','placeholder':'密碼請由8位數的英數字組成', hidden:true},
        {id:'id','value':'','text':'帳號ID','type':'','placeholder':'', readOnly:true },
        {id:'password','value':'','text':'更新密碼','type':'password','placeholder':'密碼請由8位數的英數字組成', required:true},
        {id:'password2','value':'','text':'確認密碼','type':'password','placeholder':'密碼請由8位數的英數字組成', required:true},
      ] 

    const [ session, loading ] = useSession();
    const [list, setList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [cols, setCols] = useState();
    const [action, setAction] = useState();
    const { SearchBar } = Search;


    useEffect(()=>{
        getList(setList)
    },[]) 


  
    useEffect(()=>{
    
      if(session){
        if(!session.isAdmin){
          router.push("/admin/login")
        }
      }else{
        router.push("/admin/login")
      }
      
    },[session])
    

    const editorArea = (cell, row, rowIndex) => {
        const handleEdit = () => {
           console.log(`edit ${JSON.stringify(row)}`)
           console.log(`edit ${JSON.stringify(session)}`)
           updateRows.map((v,i) => v.value = row[v.id])
          setAction('update')
          setCols(updateRows);
          setModalShow(true)
        }
  
        const handleDel = () => {
          //console.log(`del ${cell} ${row}`)
          let yes =confirm('你確認要刪除數據嗎')
          if(yes){
            singleDel(cell, list, setModalShow, setList)
          }
        }

        const Super = () => (
          <>
          <Button variant='warning' style={{ marginRight: '4px'}} onClick={handleEdit}>編輯</Button>
          <Button variant="danger" onClick={handleDel}>刪除</Button>
          </>
        );

        const Generally = () => (
          row.id == session.userId ? 
          (<><Button variant='warning' style={{ marginRight: '4px'}} onClick={handleEdit}>編輯</Button>
          <Button variant="danger" onClick={handleDel}>刪除</Button></>)
          : null
        );
   
        return session.isSuper ? <Super/> : <Generally/>
      }

    const columns = [
        {
            dataField: 'id',
            text:'帳號編碼',
        }, 
        {
            dataField: 'name',
            text: '帳號',
            searchable: true
        },
        {
            dataField: 'update_time',
            text: '更新時間',
        },
        {
            dataField: 'update_user',
            text: '操作人員',
        }, 
        {
            dataField: 'id',
            text: '編輯區',
            formatter: editorArea
        }];

    const addBtn = () => {
      setModalShow(true);
      setAction('insert');
      setCols(rows)
    }
    
    const  checkVal = (str) => {
        var regExp = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (regExp.test(str))
            return true;
        else
            return false;
    }

 
    const handleUpdate = (files) => {

      let data = getFormData();
      if(data.password !== data.password2){
          alert('密碼不相同請重新輸入');
      }
      else if(!checkVal(data.password)){
        alert('密碼請由8位數的英數字組成');
      }
      else{
          delete data.password2;
          updateData(data, list, setModalShow, setList)
      }
      
    
    }

    const handleInsert = (e) => {
      let data = getFormData();
      data.id = uuidv4();
      if(!checkVal(data.password)){
        alert('密碼請由8位數的英數字組成');
      }else{
        addData(data, list, setModalShow, setList)
      }
      
    }

   

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
                                <h2>管理員帳號管理</h2>
                            </div>
                            <div className="globalContent"> 
                            <ToolkitProvider
                                keyField='id'
                                data={ list }
                                columns= {columns}
                                bordered={ true }
                                noDataIndication="沒有任何題目"
                            >
                                {
                                props => (
                                    <div style={{zIndex:2, position:'relative'}}>
                                    <h3>管理員帳號</h3>
                                    <span style={{float:'right', margin: '10px'}}>
                                    <Button variant='success' onClick={addBtn}>新增</Button>
                                    </span>
                                
                                    <BootstrapTable
                                        { ...props.baseProps }
                                        pagination={ paginationFactory({showTotal:true}) }
                                        filter={ filterFactory() }
                                    />
                                    </div>
                                )
                                }
                            </ToolkitProvider>
                            <ExamAdminModal 
                              show={modalShow} 
                              onHide={() => setModalShow(false)} 
                              cols = {cols}
                              handleUpdate = {handleUpdate}
                              handleInsert = {handleInsert}
                              action = {action}
                            />
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

export default Admin;