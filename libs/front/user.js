import axios from "axios";
const apiUrl = '/api/user';
const getList = (setList) => {
    axios.get(apiUrl)
    .then((res)=>
    { 
        setList(res.data.userList)
    })
    .catch((e)=>console.log(`loadExamErr: ${e}`))
}


export { getList }
