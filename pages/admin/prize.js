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
import router from 'next/router';
import ExamAdminModal from '../../components/examAdminModal'
import { getList, singleDel, updateData, addData } from '../../libs/front/prize';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


function Prize () {
    const rows = [
      {id:'prize_id','value':'','text':'獎項ID','type':'','placeholder':'系統自動產生', readOnly:true },
      {id:'prize_name','value':'','text':'獎項名稱','type':'','placeholder':'', required:true},
      {id:'prize_title','value':'','text':'獎槓標題','type':'','placeholder':'', required:true},
      {id:'prize_num','value':'','text':'獎項數量','type':'','placeholder': '', required:true},
      {id:'prize_image_url','value':'','text':'圖片','type':'file','placeholder':''},
    ] 
    const date = new Date()
    const [ session, loading ] = useSession();
    const [list, setList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [cols, setCols] = useState();
    const [action, setAction] = useState();
    const [prizeIdList, setPrizeIdList] = useState([]);
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

    const formData = () => {
      let f = document.querySelector('form')
      let fd = new FormData(f);
      let data = Object.fromEntries(fd);
      data.prize_num = parseInt(data.prize_num);

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
        <Button variant='warning' onClick={handleEdit}>編輯</Button>
        <Button variant="danger" onClick={handleDel}>刪除</Button>
      </>)
    }

    const addBtn = () => {
      setModalShow(true);
      setAction('insert');
      setCols(rows)
    }

    // const batchDelBtn = () => {
    //   const data = {prize_id_list : prizeIdList};
    //   let yes =confirm('是否進行批量刪除')
    //   if(yes){
    //     batchDel(data, setList)
    //   }
    // }
 
    const handleUpdate = (files) => {

      let data = formData();

      if(files){
        // 上傳檔案
        //fd.append('file',files)
        let fileData = new FormData();
        fileData.append('file',files);
        axios.post('/api/prize/uploadImage', fileData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })  
        .then((res) => {
            // console.log(`upload img success: ${res.data.imageUrl}`)
            data.prize_image_url = res.data.imageUrl
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
      data.prize_id = uuidv4();
      addData(data, list, setModalShow, setList)
    }

    const columns = [
      {
        dataField: 'prize_id',
        text:'獎項ID',
      }, {
        dataField: 'prize_name',
        text: '獎項名稱',
        searchable: true
      }, {
        dataField: 'prize_title',
        text: '獎項標題',
      },
      {
        dataField: 'prize_num',
        text: '獎項數量',
      },
     {
        dataField: 'prize_id',
        text: '編輯區',
        formatter: editorArea
      }];

      // const handleRowSelect = (row, isSelected, e) => {
      //   console.log(row)
      //   console.log(isSelected)
      //   if(isSelected) {
      //     setPrizeIdList(oldArr => [...oldArr, row.exam_id])
      //   }else{
      //     setPrizeIdList(prizeIdList.filter(item => item !== row.exam_id))
      //   }
      //   //console.log(prizeIdList)
      // }

      // const handleSelectAll = (isSelected, rows, e) => {
      //   console.log(rows)
      //   console.log(isSelected)
      //   if(isSelected) {
      //     rows.map(v => {
      //       console.log(v.exam_id)
      //       setPrizeIdList(oldArr => [...oldArr, v.exam_id])
      //     })
      //   }else{
      //     setPrizeIdList([])
      //   }
      //   // console.log(prizeIdList)
      // }
     
      // const selectRow = {
      //   mode: 'checkbox',  // multi select
      //   onSelect: handleRowSelect,
      //   onSelectAll: handleSelectAll
      // };

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
                                <h2>獎項管理</h2>
                            </div>
                            <div className="globalContent"> 
                            <ToolkitProvider
                                keyField='exam_id'
                                data={ list }
                                columns= {columns}
                                bordered={ true }
                                noDataIndication="沒有任何題目"
                                search={{
                                    searchFormatted: true
                                  }}
                            >
                                {
                                props => (
                                    <div style={{zIndex:2, position:'relative'}}>
                                    <h3>獎項修改</h3>
                                    <SearchBar  { ...props.searchProps } />
                                    <span style={{float:'right'}}>
                                    {/* <Button variant='danger' style={{ margin:5}} onClick={batchDelBtn}>批量刪除</Button> */}
                                    <Button variant='success' onClick={addBtn}>新增</Button>
                                    </span>
                                    <hr />
                                    <BootstrapTable
                                        { ...props.baseProps }
                                        pagination={ paginationFactory({showTotal:true}) }
                                        filter={ filterFactory() }
                                        // selectRow={ selectRow }
                                    />
                                    </div>
                                )
                                }
                            </ToolkitProvider>
                            <ExamAdminModal 
                              show={modalShow} 
                              onHide={() => setModalShow(false)} 
                              cols = {cols}
                              action = {action}
                              handleUpdate = {handleUpdate}
                              handleInsert = {handleInsert}
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

export default Prize;