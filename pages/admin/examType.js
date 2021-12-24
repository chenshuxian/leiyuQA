/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import react, {useEffect, useState} from 'react'
import Layout from '../../components/adminLayout'
import Image from 'next/image'
import mainBanner from '../../public/assets/images/mainBanner.png';
import { signIn, signOut, useSession } from 'next-auth/client'
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory,{ selectFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import "../../node_modules/react-datepicker/dist/react-datepicker.min.css"
import Login from "../admin/login"
import ExamAdminModal from '../../components/examAdminModal'
import { getList, singleDel, updateData, addData } from '../../libs/front/examType';
import { v4 as uuidv4 } from 'uuid';

import axios from 'axios';

function examType () {
    const rows = [
        {id:'exam_type_id','value':'','text':'類別ID','type':'','placeholder':'系統自動產生', readOnly:true },
        {id:'exam_type_name','value':'','text':'類別名稱','type':'','placeholder':'', required:true}
    ] 
    const [ session, loading ] = useSession();
    const [list, setList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [cols, setCols] = useState();
    const [action, setAction] = useState();
    const [examIdList, setExamIdList] = useState([]);

    useEffect(()=>{
      getList(setList)
    },[])

    if(!session){
      return <Login />
    }

    const formData = () => {
      let f = document.querySelector('form')
      let fd = new FormData(f);
      let data = Object.fromEntries(fd);

      return data;
    }
 
    const editorArea = (cell, row, rowIndex) => {
      const handleEdit = () => {
         console.log(`edit ${JSON.stringify(row)}`)
        rows.map((v,i) => v.value = row[v.id])
        setAction('update')
        setCols(rows);
        setModalShow(true)
      }

      const handleDel = () => {
        //console.log(`del ${cell} ${row}`)
        let yes =confirm('你確認要刪除數據嗎')
        if(yes){
          singleDel(cell, list, setModalShow, setList)
        }
      }

      return (
      <>
        <Button variant='warning' onClick={handleEdit} style={{marginRight:"6px"}}>編輯</Button>
        <Button variant="danger" onClick={handleDel}>刪除</Button>
      </>)
    }

    const addBtn = () => {
      setModalShow(true);
      setAction('insert');
      setCols(rows)
    }
 
    const handleUpdate = (files) => {

      let data = formData();

      if(files){
        // 上傳檔案
        //fd.append('file',files)
        let fileData = new FormData();
        fileData.append('file',files);
        axios.post('/api/exam/uploadImage', fileData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })  
        .then((res) => {
            // console.log(`upload img success: ${res.data.imageUrl}`)
            data.exam_img_url = res.data.imageUrl
            updateData(data, list, setModalShow, setList)
        })
        .catch((e) => console.log(`upload img ERR: ${e}`))
      }else{
        // 無上傳檔案
        updateData(data, list, setModalShow, setList)
      }
    }

    const handleInsert = (e) => {
      let data = formData();
      data.exam_type_id = uuidv4();
      addData(data, list, setModalShow, setList)
    }

    const columns = [
      {
        dataField: 'exam_type_id',
        text:'類別ID',
      }, {
        dataField: 'exam_type_name',
        text: '類別名稱'
      },{
        dataField: 'exam_type_id',
        text: '編輯區',
        formatter: editorArea
      }];

      const handleRowSelect = (row, isSelected, e) => {
        console.log(row)
        console.log(isSelected)
        if(isSelected) {
          setExamIdList(oldArr => [...oldArr, row.exam_id])
        }else{
          setExamIdList(examIdList.filter(item => item !== row.exam_id))
        }
        //console.log(examIdList)
      }

      const handleSelectAll = (isSelected, rows, e) => {
        console.log(rows)
        console.log(isSelected)
        if(isSelected) {
          rows.map(v => {
            console.log(v.exam_id)
            setExamIdList(oldArr => [...oldArr, v.exam_id])
          })
        }else{
          setExamIdList([])
        }
        // console.log(examIdList)
      }
     
      const selectRow = {
        mode: 'checkbox',  // multi select
        onSelect: handleRowSelect,
        onSelectAll: handleSelectAll
      };

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
                                <h2>題庫類別管理</h2>
                            </div>
                            <div className="globalContent"> 
                            <ToolkitProvider
                                keyField='exam_type_id'
                                data={ list }
                                columns= {columns}
                                bordered={ true }
                                noDataIndication="沒有任何題目"
                            >
                                {
                                props => (
                                    <div style={{zIndex:2, position:'relative'}}>
                                    <h3>類別修改</h3>
                                    <span style={{float:'right', margin:'12px'}}>
                                    <Button variant='success' onClick={addBtn}>新增</Button>
                                    </span>
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


export default examType;