
export default function QA (props) {
    const { examNum, exam, examAns} = props;
    return (
        <div className="inner">
        <div className="textTitle">
            <span></span>
            <span className="right"></span>
            <h2>文化題</h2>
        </div>
        <div className="globalContent">
            <h3>{`${examNum+1}. ${exam[examNum].exam_title}`}</h3>
            <ul className="radio">
                {exam[examNum].exam_option.map((v,i)=> {
                    // console.log( `${examAns[i]} : ${i+1}`)
                     // console.log( examAns[i] === i+1)
                    if(examAns[examNum] === i+1) {
                        return (<li key={i}><Button style={{margin:"2px", height:"55px", width:"100%"}} variant='danger' onClick={()=> setAns(examNum,i+1,exam[examNum].exam_id)}>{v}</Button></li>)
                    }else{
                        return (
                            <li key={i}><Button style={{margin:"2px", height:"55px", width:"100%"}} variant='info' onClick={()=> setAns(examNum,i+1,exam[examNum].exam_id)}>{v}</Button></li>)
                    }
                   
                })}
            </ul>
           <ul className="pageNum">
           <li><Button style={{margin:"2px", height:"40px", width:"100%"}} variant='success' onClick={()=> upQ(examNum)}> 上一題 </Button></li>
               {examAns.map((v,i) => {
                 if(examNum == i) {
                     // focus
                    return  (<li key={i}><Button style={{margin:"2px"}} variant='info' onClick={()=> changeQ(i)}> {i+1} </Button></li>)
                  } else {
                    if(v !== 0)
                      return (<li key={i}><Button style={{margin:"2px"}} variant='danger' onClick={()=> changeQ(i)}> {i+1} </Button></li>)
                    else
                      return (<li key={i}><Button style={{margin:"2px"}} variant='success' onClick={()=>changeQ(i)}> {i+1} </Button></li>)
                  }
                }
               )}
               <li><Button style={{margin:"2px", height:"40px", width:"100%"}} variant='success' onClick={()=> nextQ(examNum)}> 下一題 </Button></li>
           </ul>
           <ul style={{textAlign:'center',marginTop:'6px'}}>
               <li>
                   <Button variant="info" onClick={()=>getScore()}>送出</Button>
               </li>
           </ul>
        </div>
    </div>
    )
  }