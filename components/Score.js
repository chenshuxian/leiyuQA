
export default function Score (props) {
    return (
          <div className="inner">
              <div className="textTitle">
                  <span></span>
                  <span className="right"></span>
                  <h2>你的成積</h2>
              </div>
              <div className="globalContent">
                  <h6 className="number">你的分數 <b>{props.score}</b>分</h6>
                  <ul className="globalCounter">
                      {props.ansList.map((v,i)=> (
                          <li key={i}>
                              <h3>{v.exam_title}</h3>
                              <ol className="radio">
                                  <li className="right">
                                      <input type="checkbox" id="radio1" name="radios" value="all" />
                                      <label htmlFor="radio1">{v.exam_ans}</label>
                                  </li>
                                  <li className="wrong">
                                      <input type="checkbox" id="radio2" name="radios" value="all" />
                                      <label htmlFor="radio2">{v.exam_ans_err}</label>
                                  </li>
                              </ol>
                          </li>
                      ))}
                     
                  </ul>
                  <ul className="button">
                      <li><input type="button" value="分享" /></li>
                      <li><input type="button" value="再玩一次" /></li>
                  </ul>
              </div>
          </div>
    )
  }