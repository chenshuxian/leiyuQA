import react,{useState, useEffect} from 'react'
import Layout from '../components/layout'
import Image from 'next/image'
import mainBanner from '../public/assets/images/mainBanner.png';
import { postData } from '../libs/fetch';
import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import { useRouter } from 'next/router'


function UserProfile () {
    const [session, loading] = useSession()
    // console.log(`userProfile: ${JSON.stringify(session)}`)
    const [form, setForm] = useState({
        name: '',
        phone: '',
        addr: '',
        id: session ? session.userId : ''
    })
    //const [userId, setUserId] = useState()
    const [products, setProducts] = useState([])
    
    const router = useRouter()	
    useEffect(()=>{
        if(session){
          document.getElementById("name").value = session.user.name
          document.getElementById("phone").value = session.user.phone
          document.getElementById("addr").value = session.user.addr
          Object.assign(form,{name:session.user.name,phone:session.user.phone,addr:session.user.addr})
	   axios.get(`/api/ticket?userId=${session.userId}`)
	  .then((res) => {
		 // console.log(res);
		setProducts(res.data.ticketList)
	  })
	  .catch((e) => console.log(e));
	  setForm(form)
        }else{
		router.push('/auth/signin')
	}
      }, [session, form])

    const changeState = (e) => {
        console.log(`changeState: ${e.target.value}`)
        let changeName = e.target.name
            //再把他目前的value拿去更改state
        Object.assign(form,{ [changeName]: e.target.value })
        setForm(form)
    }

    const submitForm = async (e) => {
        e.preventDefault();
        console.log(`formData : ${JSON.stringify(form)}`);
         axios.patch('/api/me',form)
        .then(data => {
            console.log(data)
            if(data.success){
                console.log("會員資料修改完成")
            }
           
        })
        .catch(error => console.error(error))
        
    }

    const columns = [{
        dataField: 'ticket_id',
        text:'彩券號碼',
        sort: true,
        sortCaret: (order, column) => {
            if (!order) return (<span>&nbsp;&nbsp;Desc/Asc</span>);
            else if (order === 'asc') return (<span>&nbsp;&nbsp;Desc/<font color="red">Asc</font></span>);
            else if (order === 'desc') return (<span>&nbsp;&nbsp;<font color="red">Desc</font>/Asc</span>);
            return null;
          }
      }, {
        dataField: 'month',
        text: '時間',
        sort: true
      }, {
        dataField: 'month_prize_id',
        text: '是否中獎',
        sort: true
      }];


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
                                <h2>會員資訊頁</h2>
                            </div>
                            <div className="globalContent">
                                <ul className="input">
                                    <form onSubmit={submitForm}>
                                        <li><b>姓名</b><input type="text" id="name" name="name"  onChange={changeState}/></li>
                                        <li><b>手機</b><input type="text" id="phone" name="phone"  onChange={changeState}/></li>
                                        <li><b>地址</b><input type="text" id="addr" name="addr"  onChange={changeState}/></li>
                                        <li><input type="submit" value="修改" /></li>
                                    </form>
                                    <li><Button onClick={()=> signOut()}>登出</Button></li>
                                </ul>
                                <BootstrapTable
                                    keyField='ticket_id'
                                    data={ products }
                                    columns= {columns}
                                    bordered={ true }
                                    noDataIndication="沒有任何彩券"
                                    pagination={ paginationFactory() }
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

export default UserProfile;
