20220322 註解一下兩段代碼
examType.js 
    // 是否今日遊戲機會已用完
	// useEffect(()=>{
    //     axios.get('/api/me')
	//     .then((res) => {
	// 	const is_shared = res.data.is_shared;
    //     const countGame = res.data.count;
    //     setCount(countGame);
	// 	if(!is_shared || countGame > 2){
	// 		setScorePage('ALERT')
	// 	}
    //     })
    //     .catch((e) => {
    //         console.log(`exam is_shared err: ${e}`)
    //     })
    // },[])


    const share = () => {
        // 分享到fb 取得在玩一次的機會
        router.push("/#game")
        // FB.ui({
        //     display: 'popup',
        //     method: 'feed',
        //     link: 'https://lyquiz.kinmen.travel/'
        //   }, function(response){ 
        //         if (response && !response.error_message) {
        //             let data = {is_shared: true}
        //             axios.patch('/api/me',data)
        //             .then((res) => {
        //                 router.push('/#game')
        //             }
        //             ).catch((e)=>{
        //                 console.log(`share fb err: ${e}`)
        //             })
                    
        //         } else {
        //             alert('Error while posting.11');
        //         }
        //     });
    }

submitAnswer.js
     // if (isQuotaExceeded) {
      //   res.status(400).json(errorCode.QuotaExceeded);
      //   return;
      // }

v20220429
遊戲只剩一個入口，選出10題混合題目，不在依類別選題

v20220501
取消登入功能，以利測試

v20220530
1 背景圖八達樓子的圖放正
2 摸彩頁中獎人名字第二個字mark起來
3 摸彩頁的中獎由頭獎開始排序 
4 答案呈現時呈現哪一個是正解哪個是用戶所選錯誤答案
5 申請facebook登入重啟用

v20220624
1 增加背影樂
2 修改背影圖
3 新增旅遊網連結
4 遊戲分享修改
    1進入遊戲頁如果尚未分享且遊戲次數尚未達3次，警告頁面呈現尚有遊玩次數，並提示點擊分享將可取得再玩的機會
    2如果已達一日上限，且直接顯示本遊玩次數已達上限。