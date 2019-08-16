var api = require('etherscan-api').init('S8MD5THU86R9YCS3T1763299WDU9YKPRGG','rinkeby','3000')
const address = '0x44A9D17E868186dFea4D2798b307D39692716a38'
const topic0 = '0x65adfbd8b95db8cf4236cb2241c735e0b147ba0b912d34f7de046692f9db3b43'
getGame_id = function(fromBlock, p_transactionHash, callback){
    setTimeout(()=>{
        api.log.getLogs(address, fromBlock, "latest", topic0
        ).then(data=>{
            // iteration
            var i = data.result.length - 1
            for(;i > 0;i--){
                let transactionHash = data.result[i].transactionHash
                if(transactionHash === p_transactionHash){
                    let information = data.result[i].data
                    let game_info = information.substring(information.length - 4, information.length)
                    return callback(parseInt(game_info,10))
                }
            }
            return callback(null)
            
        }).catch(error =>{
            console.log("error in log",error)
            return callback(null)
        })
    }, 1000)

}

// getGame_id("0", '0x2955e7baba7ec18a604aa505b86e8f35b6ec6194dc9f42ec057c92ed60a4db4c', function(
//    result
// ){
//     console.log("information",result)
// })


