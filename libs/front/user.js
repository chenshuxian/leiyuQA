import axios from "axios";
const apiUrl = '/api/user';
const getList = (setList) => {
    axios.get(apiUrl)
    .then((res)=>
    { 
        //console.log(`examList: ${JSON.stringify(res.data.examList)}`)
        setList(res.data.userList)
    })
    .catch((e)=>console.log(`loadExamErr: ${e}`))
}


export { getList }
