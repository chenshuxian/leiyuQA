import axios from "axios";
const apiUrl = '/api/ticket/draw';
const apiUrl2 = '/api/ticket?isWinner=true';
const getDrawer = async (data) => {
     const res = await axios.post(apiUrl,data);
     return res;
}

const getLuckyList = (setList) => {
     axios.get(apiUrl2)
    .then((res)=>
    { 
        setList(res.data.ticketList)
    })
    .catch((e)=>console.log(`loadExamErr: ${e}`))
}


export { getDrawer, getLuckyList }
