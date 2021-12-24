import axios from "axios";
const apiUrl = '/api/prize';
const getList = (setList) => {
    axios.get(`${apiUrl}?isDelete=false`)
    .then((res)=>
    { 
        //console.log(`examList: ${JSON.stringify(res.data.examList)}`)
        setList(res.data.prizeList)
    })
    .catch((e)=>console.log(`loadExamErr: ${e}`))
}

const singleDel = (id, list, setModalShow, setList) => {
    axios.delete(`${apiUrl}/${id}`)
    .then((res) => {
      if(res.data){
        setModalShow(false)
        list.filter(function(item, index, array){
          if(item.prize_id === res.data.prize_id){
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

const updateData = (data, list, setModalShow, setList) => {
    axios.patch(`${apiUrl}/${data.prize_id}`,data)
    .then((res) => {
      if(res.data){
        setModalShow(false)
        list.filter(function(item, index, array){
          if(item.prize_id === res.data.prize_id){
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

const addData = (data, list, setModalShow, setList) => {
    axios.post(`${apiUrl}`,data)
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



export { getList, singleDel, updateData, addData }
