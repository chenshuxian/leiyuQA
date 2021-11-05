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

import { PrismaClient } from '@prisma/client'
import axios from 'axios';
const prisma = new PrismaClient()



function examAdmin ( {examTypeObj}) {
    const rows = [
      {id:'exam_id','value':'','text':'題號','type':'','placeholder':'系統自動產生', readOnly:true },
      {id:'exam_type_id','value':'','text':'類別','type':'select','placeholder':'','option':examTypeObj},
      {id:'exam_title','value':'','text':'標題','type':'','placeholder':'', required:true},
      {id:'exam_option','value':'','text':'選項','type':'','placeholder':'格式: 選項1,選項2,選項3,選項4', required:true},
      {id:'exam_ans','value':'','text':'答案','type':'','placeholder':'格式: 1,2,3,4', required:true},
      {id:'exam_img_url','value':'','text':'圖片','type':'file','placeholder':''},
      {id:'exam_video_url','value':'','text':'影片','type':'','placeholder':'格式: http://www.youtube.com/xxxxxxx'}
    ] 
    const date = new Date()
    const [ session, loading ] = useSession();
    const [list, setList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [cols, setCols] = useState();
    const [action, setAction] = useState();
    const [examIdList, setExamIdList] = useState([]);
    const { SearchBar } = Search;

    const getList = () => {
      axios.get(`/api/exam?isDelete=false`)
      .then((res)=>
      { 
          //console.log(`examList: ${JSON.stringify(res.data.examList)}`)
          setList(res.data.examList)
      })
      .catch((e)=>console.log(`loadExamErr: ${e}`))
    }
    useEffect(()=>{
      getList()
   },[])


    if(!session){
      return <Login />
    }


    // const selectOptions = {'圖書':'圖書','文化':'文化','綜合':'綜合'}

    const autoId = (cell, row, rowIndex) => {
        return rowIndex+1
    }
    
    const examOption = (cell, row, rowIndex) => {
        return cell.join(' / ')
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
          axios.delete(`/api/exam/${cell}`)
          .then((res) => {
            if(res.data){
              setModalShow(false)
              list.filter(function(item, index, array){
                if(item.exam_id === res.data.exam_id){
                  let newList = [...list];
                  newList.splice(index,1);
                  setList(newList);
                  alert('刪除成功')
                }
              })
            
             }
        })
        .catch((e) => console.log(`upload img ERR: ${e}`))
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

    const batchDel = () => {

      const data = {exam_id_list : examIdList};
      let yes =confirm('是否進行批量刪除')

      if(yes){
        axios.post('/api/exam/batchDelete',data)
        .then((res) => {
          if(res.data.count){
            getList()
          }
        })
        .catch((e)=> console.log(`exam delete batch err: ${e}`))
      }
    }
    
    const updateData = (data) => {
      axios.patch(`/api/exam/${data.exam_id}`,data)
      .then((res) => {
        if(res.data){
          setModalShow(false)
          list.filter(function(item, index, array){
            if(item.exam_id === res.data.exam_id){
              let newList = [...list];
              newList[index] = res.data
              setList(newList);
              alert('修改成功')
            }
          })
        
         }
    })
    .catch((e) => console.log(`upload img ERR: ${e}`))
    }

    const formData = () => {
      let f = document.querySelector('form')
      let fd = new FormData(f);
      let data = Object.fromEntries(fd);
      data.exam_ans = parseInt(data.exam_ans)
      data.exam_option = data.exam_option.split(',')

      return data;
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
            updateData(data)
        })
        .catch((e) => console.log(`upload img ERR: ${e}`))
      }else{
        // 無上傳檔案
        updateData(data)
      }
    }

    const handleInsert = (e) => {
      let data = formData();
      delete data.exam_id;
      axios.post('/api/exam',data)
      .then((res) => {
        console.log(res);
        setModalShow(false)
        let newList = [...list];
        newList.unshift(res.data)
        setList(newList);
        alert('新增成功')
      })
      .catch((e) => console.log(`insert exam data ERR: ${e}`))
      }
   
    // function UpdatedModal(props) {

    //   const { show, onHide, title, cols } = props
    //   const [files, setFiles] = useState();
    //   const [images, setImages] = useState();
    //   const [fileName, setFileName] = useState('圖片上傳');
     
    //   const handleImageChange = (e) => {
    //     e.preventDefault();
    //     let reader = new FileReader();
    //     let file = e.target.files[0];
    //     reader.readAsDataURL(file);
    //     reader.onloadend = (e) => {
    //       setFiles(file)
    //       setImages(reader.result)
    //       setFileName(file.name)
    //     };
    //   }

    //   const cancelImage = () => {
    //     setFiles();
    //     setImages();
    //     setFileName('圖片上傳');
    //   }
    
    //   const inputType = (v) => {
    //     switch (v.type) {
    //       case 'select':
    //             return(
    //             <Form.Control as="select" placeholder="" defaultValue={v.value} name={v.id} >
    //                 {Object.keys(v.option).map((k,i)=> (<option key={i} value={k}>{v.option[k]}</option>))}
    //             </Form.Control>)
    //         break
    //       case 'file':
    //        return(<><Form.File 
    //         id="image-file"
    //         label={fileName}
    //         custom
    //         onChange={handleImageChange}
    //       />
    //       <img src={images} style={{maxHeight:300, margin:5}}></img>
    //       {files ? <Button onClick={cancelImage}>取消上傳圖片</Button> : null}
    //       </>)
    //         break
    //       default:
    //         return (<Form.Control placeholder={v.placeholder} defaultValue={v.value} readOnly={v.readOnly} name={v.id} />)
    //     }
    //   }
  
    //   return (
    //     <Modal
    //       show={show} 
    //       onHide={onHide}
    //       size="lg"
    //       aria-labelledby="contained-modal-title-vcenter"
    //       centered
    //     >
    //       <Modal.Header closeButton>
    //         <Modal.Title id="contained-modal-title-vcenter">
    //           {title}
    //         </Modal.Title>
    //       </Modal.Header>
    //       <Modal.Body style={{marginLeft:"60px", maxHeight: 'calc(100vh - 210px)',
    //   overflowY: 'auto'}}>
    //        <Form>
    //          {cols && cols.map((v,i) => (
    //             <Form.Group key={`examForm${i}`} as={Row}>
    //               <Form.Label column sm={2}>
    //                 {v.text}
    //               </Form.Label>
    //               <Col sm={8}>
    //                 {inputType(v)}
    //               </Col>
    //             </Form.Group>
    //          ))}
    //        </Form>
    //       </Modal.Body>
    //       <Modal.Footer>
    //         <Button variant='warning' onClick={() => handleUpdate(files)}>修改</Button>
    //         <Button onClick={props.onHide}>Close</Button>
    //       </Modal.Footer>
    //     </Modal>
    //   );
    // }

    const columns = [
      {
        dataField: 'id',
        text:'題號',
        formatter: autoId
      }, {
        dataField: 'exam_type_id',
        text: '類別',
        formatter: cell => examTypeObj[cell],
        filter: selectFilter({
          options: examTypeObj
        })
      }, {
        dataField: 'exam_title',
        text: '問題',
        searchable: true
      },
      {
        dataField: 'exam_option',
        text: '選項',
        formatter: examOption
      }, {
        dataField: 'exam_ans',
        text: '答案',
      },{
        dataField: 'exam_id',
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
     
      const selectRow = {
        mode: 'checkbox',  // multi select
        onSelect: handleRowSelect
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
                                <h2>題庫管理</h2>
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
                                    <h3>題庫修改</h3>
                                    <SearchBar  { ...props.searchProps } />
                                    <span style={{float:'right'}}>
                                    <Button variant='danger' style={{ margin:5}} onClick={batchDel}>批量刪除</Button>
                                    <Button variant='success' onClick={addBtn}>新增</Button>
                                    </span>
                                    <hr />
                                    <BootstrapTable
                                        { ...props.baseProps }
                                        pagination={ paginationFactory({showTotal:true}) }
                                        filter={ filterFactory() }
                                        selectRow={ selectRow }
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

export async function getStaticProps(context) {

  // const examList = await prisma.exam.findMany({
  //     select:{
  //         exam_id:true,
  //         exam_type_id:true,
  //         exam_title:true,
  //         exam_option:true,
  //         exam_ans:true,
  //         exam_img_url:true,
  //         exam_video_url:true
  //     },
  //     orderBy: {
  //         exam_type_id: 'asc'
  //     }
  // })

  const examTypeList = await prisma.exam_type.findMany({
      select:{
          exam_type_id: true,
          exam_type_name: true
      }
  })

    const examTypeObj = examTypeList.reduce((obj, cur) => ({...obj, [cur.exam_type_id]: cur.exam_type_name}), {})
    console.log(`examList ${JSON.stringify(examTypeObj)}`)

  return {
    props: {
        examTypeObj
    }, // will be passed to the page component as props
  }
}

export default examAdmin;