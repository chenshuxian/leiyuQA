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
import Login from "./login"
import ExamAdminModal from '../../components/examAdminModal'
import { getList, singleDel, batchDel, updateData, addData } from '../../libs/front/examAdmin';
import { v4 as uuidv4 } from 'uuid';
import router from 'next/router';
import axios from 'axios';




function examAdmin () {
    
    const date = new Date()
    const [ session, loading ] = useSession();
    const [list, setList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [cols, setCols] = useState();
    const [action, setAction] = useState();
    const [examIdList, setExamIdList] = useState([]);
    const [examTypeObj, setExamTypeObj] = useState([]);
    const { SearchBar } = Search;

    const rows = [
      {id:'exam_id','value':'','text':'題號','type':'','placeholder':'系統自動產生', readOnly:true },
      {id:'exam_type_id','value':'','text':'類別','type':'select','placeholder':'','option':examTypeObj},
      {id:'exam_title','value':'','text':'標題','type':'','placeholder':'', required:true},
      {id:'exam_option','value':'','text':'選項','type':'','placeholder':'格式: 選項1,選項2,選項3,選項4', required:true},
      {id:'exam_ans','value':'','text':'答案','type':'','placeholder':'格式: 1,2,3,4', required:true},
      {id:'exam_img_url','value':'','text':'圖片','type':'file','placeholder':''},
      {id:'exam_video_url','value':'','text':'影片','type':'','placeholder':'格式: http://www.youtube.com/xxxxxxx'}
    ] 

    useEffect(()=>{
    
      if(session){
        if(session.isAdmin){
          router.push("/admin")
        }else{
          router.push("/admin/login")
        }
      }else{
        router.push("/admin/login")
      }
      
    },[session])


    useEffect(()=>{
      getList(setList)
    },[])

    useEffect(()=> {
      axios.get('/api/examType')
      .then((res) => {
          let data = res.data.examTypeList.reduce((obj, cur) => ({...obj, [cur.exam_type_id]: cur.exam_type_name}), {})
          setExamTypeObj(data)
      })
      .catch((e) =>  console.log(`index get prize err: ${e}`))
  },[])

    
    const formData = () => {
      let f = document.querySelector('form')
      let fd = new FormData(f);
      let data = Object.fromEntries(fd);
      data.exam_ans = parseInt(data.exam_ans)
      data.exam_option = data.exam_option.split(',')

      return data;
    }

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

    const batchDelBtn = () => {
      const data = {exam_id_list : examIdList};
      let yes =confirm('是否進行批量刪除')
      if(yes){
        batchDel(data, setList)
      }
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
      data.exam_id = uuidv4();
      addData(data, list, setModalShow, setList)
    }

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
                                    <Button variant='danger' style={{ margin:5}} onClick={batchDelBtn}>批量刪除</Button>
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

// export async function getStaticProps(context) {

//   const examTypeList = await prisma.exam_type.findMany({
//       select:{
//           exam_type_id: true,
//           exam_type_name: true
//       }
//   })

//     const examTypeObj = examTypeList.reduce((obj, cur) => ({...obj, [cur.exam_type_id]: cur.exam_type_name}), {})
//     // console.log(`examList ${JSON.stringify(examTypeObj)}`)

//   return {
//     props: {
//         examTypeObj
//     }, // will be passed to the page component as props
//   }
// }

export default examAdmin;