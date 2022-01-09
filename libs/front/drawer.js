import axios from "axios";
const apiUrl = '/api/ticket/draw';
const getDrawer = async (data) => {
     const res = await axios.post(apiUrl,data);
     return res;
}


export { getDrawer }
