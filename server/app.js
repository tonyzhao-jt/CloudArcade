// code, 0 for true,  1 for false and 2 for error
// Default server settings
// DBUtil models
const Service = require("./DBUtil.js").Service
const Players = require("./DBUtil.js").Players
const Games = require("./DBUtil.js").Games
const sequelize = require("./DBUtil.js").sequelize
const Record = require("./DBUtil.js").Record
// Signature Checker
const isValidSignature = require('./signerCheck').isValidSignature
// Express
const express = require('express')
// Cors
var fs=require('fs');
var cors = require('cors');
var corsOptions = {
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080'], 
    optionsSuccessStatus: 200
}
const app = express()
const HOST = '127.0.0.1'
const PORT = '7000'

// JSON middle ware
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Static Places
app.use(express.static('public'))

// Socket. Web socket
let server = require('http').Server(app)
let io = require('socket.io')(server)
//  web socket Listening port
server.listen(3000,'127.0.0.1');

io.on('connection', (socket) => {
    console.log('Connected With Client:'+socket.id)
    // socket.on('priceUpdate', () => {
    //     gamePriceUpodated()
    // })
    // socket.on('gameInfo', (data) => {
    //     getAllGameInfo(result =>{
    //         io.emit('gameInfo', result)
    //     })
    // })
})

// BroadcastUpdatedGamesInfo
// BroadCast Information When Needed
// 1. New Signature received
BroadcastUpdatedGamesInfo = function () {
    // updated price
    getCurrentGamePrice(price =>{
        io.emit('priceUpdate', {priceData:price})
    })
    // updated games' info
    getAllGameInfo(result =>{
        io.emit('gameInfo', result)
    })
}

// getCurrentGamePrice
// Pricing different games here
getCurrentGamePrice = function(callback){
    // pricing logic here
    return callback([1,2,3])
}
// Uodate the Service Record When Allocated
updateServiceRecord = function(serviceID, callback){
    var selector = {where:{serviceID: serviceID}}
    var values = {available:"0"}
    console.log("here aa")
    Service.update(values, selector).then(
    result => {
        console.log('done in final', result)
        callback(true)
    }).catch(error =>{
        console.log('not done in final', error)
        callback(false)
    })
}

// GetAllGameInfo
// 1.Get all games available in Cloud Arcade
// 2.Get games crowdness in Cloud Arcade
//   Crowdness = 1 - available/total
getAllGameInfo = function (callback) {
    Games.findAll().then(result =>{
        let games_info = result
        Service.findAll(
            {
                attributes: ['game_id',[sequelize.fn('count', sequelize.col('available')), 'total'], [sequelize.fn('sum', sequelize.col('available')), 'totalAvailable']],
                group : ['game_id'],
                raw: true,
            }
        ).then(result =>{
            let crowdness_info = result
            getCurrentGamePrice(result =>{
                let price_info = result
                callback({code:0, result:{games_info: games_info, crowdness_info: crowdness_info, price_info:price_info}})
            })
        }, error =>{
            callback({code:2})
        })
    },(error =>{
        callback({code:2})
    }))  
}
// Corresponding URL for game information fetch
app.get('/getAllGames', cors(corsOptions), function(req, res){
    getAllGameInfo(result =>{
        return res.json(result)
    })
})
// welcome console log
app.get('/', (req, res) => res.send('Server Root'))

// Gameover signal
// Release the service
app.post('/sendGameOver', function(req, res){
    var serviceID = req.body.serviceID || ''
    if(!serviceID){
        return res.json({status:"error", msg:"wrong input"})
    }
    var selector = {where:{serviceID: serviceID}}
    var values = {available:"1"}
    Service.update(values, selector).then(
    result => {
        return res.json({status:"ok"})
    }).catch(error =>{
        console.log('error')
        return res.json({status:"nok"})
    })
})

// Record Abandoned Payment Channel
// try again if went wrong
RecordClosedPaymentChannel = function(channel_address, latestSignature, amount, cnt){
    record_text = {
        RecordChannelAddress:channel_address,
        lastSignature: latestSignature,
        amount: amount
    }
    Record.create(record_text).then(result =>{
        console.log('Record abandoned channel ok')
    }).catch(e =>{
        if(cnt == 1){
            console.log('problems in recording')
        }
        RecordClosedPaymentChannel(channel_address, latestSignature, amount, 1)
    })
}

// Get paymment channel info from DB
// 1. Address 2. Latest signature 3. accumulated amount
getPaymentChannelFromDB = function(player_address, callback){
    if(!player_address){
        callback({code:2})
    }
    // console.log("add", player_address)
    Players.findOne({
        where:{
            playerAddress:player_address,
        },
    }).then(player =>{
        let paymentchannel_address = player.get('paymentChannelAddress')
        let latestSignature = player.get('latestSignature')
        let accumulatedAmount = player.get('accumulatedAmount')
        if(!paymentchannel_address){
            callback({code:1})
        }
        callback({
            code:0, 
            address:paymentchannel_address, 
            latestSignature:latestSignature,
            accumulatedAmount:accumulatedAmount
        })
    }).catch(error =>{
        callback({code:2})
    })
}

// Auto register
// register address when it is not store in local db
autoReg = function (playerAddress, channel_address, callback) {
    Players.findAll(
        {where:{
            playerAddress:playerAddress
        }}
    ).then(player =>{
        // console.log('players', player)
        if(player.length > 0){
            callback({code:1})
        }else{
            // console.log('Creating New User')
            let new_amount = 0
            let new_signature = ""
            let new_pl_info = {
                playerAddress: playerAddress, 
                accumulatedAmount: new_amount , 
                paymentChannelAddress: channel_address, 
                latestSignature: new_signature
            }
            Players.create(new_pl_info)
            .then(ok => {callback({code:0})})
            .catch(e => {callback({code:2})});
            }
        
    }).catch(error =>{
        callback({code:2})
    })
}

// Receive Signature and check whether the newly addition price is valid
// 1. Get the current game price
// 2. Get the old accumulated amount, and new amount
// 3. Calculate payment price, check whether price is available
// 4. Y, Check signature is valid or not
// 5. Y, Allocate game service, updating the price 
app.post('/postSignature', cors(corsOptions), function(req, res){
    // params check
    var payer_address = req.body.payerAddress || ''
    var signature = req.body.signature || ''
    var contract_address = req.body.contract_address || ''
    var game_id = req.body.game_id || ''
    if(payer_address && signature && contract_address && game_id){}else{
        return res.json({status:'error', code:2, msg:'Wrong Params'})
    }

    // get cuurent game price
    getCurrentGamePrice(current_price =>{
        // get the accumulated amount of a player
        getPaymentChannelFromDB(payer_address, function(result){
            if(result.code == 0){
                if(result.latestSignature == signature){
                    return res.json({status:'error', code:1, msg:'Old Signature'})
                }
                let accumulatedAmount = result.accumulatedAmount
                let total_amount = parseInt(accumulatedAmount,10) + parseInt(current_price[game_id-1],10)
                let valid = isValidSignature(contract_address, total_amount, signature, payer_address)
                // console.log("valid",valid)
                if(valid){
                    values = {
                        accumulatedAmount:total_amount,
                        latestSignature: signature
                    }
                    selector = {where: { playerAddress : payer_address}}
                    console.log(values, selector)
                    Players.update(
                        values, selector
                    ).then(result =>{
                        console.log('here')
                        getCurrentGamePrice(result =>{
                            io.emit('priceUpdate', result)
                        })
                        returnServiceURL(game_id, total_amount, res)

                    }).catch(error =>{
                        return res.json({status:'Error', code:2, msg:'error in updating'})      
                    })
                }else{
                    return res.json({status:'Error', code:1, msg:'Signature not valid'})
                }
                
            }
        })
    })
    
})

// Get the payment channel address
// return 0 when address exist, 1 when address not exits
app.post('/getPaymentChannelAddress', cors(corsOptions), function(req, res){
    let player_address = req.body.player_address || ''
    if(!player_address){
        return res.json({status:'error', code:2, msg:'Wrong Params'})
    }
    getPaymentChannelFromDB(player_address, function(result){
        if(result.code == 0){
            return res.json({status:'ok', code:0, msg:result})
        }else if(result.code == 1){
            return res.json({status:'ok', code:1, msg:'No Payment Channel Yet'})
        }else if(result.code == 2){
            return res.json({status:'error', code:2, msg:'No Payment Channel Yet'})
        }
    })
})

// Create new payment channel
// 1. If exist payment channel, then retrieve the money
// 2. Refresh the payment channel address in db
// 3. Refresh the accumulatedAmount of price
app.post('/newPaymentChannelCreated', cors(corsOptions), function(req, res){
    // basic check
    let player_address = req.body.player_address || ''
    let new_channel_address = req.body.new_channel_address || ''
    // console.log(player_address, new_channel_address)
    if(player_address && new_channel_address){}else{
        // wrong params
        return res.json({status:'error', code:2, msg:'Wrong Params'})
    }
    // get money back
    getPaymentChannelFromDB(player_address, function (result) {
        if(result.code == 0){
            // console.log("record abandoned",result)
            RecordClosedPaymentChannel(result.address, result.latestSignature, result.accumulatedAmount, 0)
        }
    })
    autoReg(player_address, new_channel_address, function(result){
        if(result.code == 0){
            return res.json({status:'ok', code:0, msg:'Registered and Updated Channel Address'})
        }else if(result.code == 2){
            return res.json({status:'error', code:2, msg:'Wrong In Registering Channel Address'})
        }else if(result.code == 1){
            // update infos for existing one
            var values = {
                paymentChannelAddress:new_channel_address,
                accumulatedAmount:0
            }
            var selector = {where: { playerAddress : player_address}}
            console.log(values, selector)
            Players.update(
                values, selector
            ).then(result =>{
                return res.json({status:'ok', code:0, msg:'Updated Channel Address'})
            }).catch(error =>{
                return res.json({status:'error', code:2, msg:'Wrong In updating Channel Address'})
            })
        }
    })
    
})

// Fetch Service URL from local DB
returnServiceURL = function(game_id, new_acc, res){
    // check whether the transaction is already be used
    Service.findOne({
        where:{
        available:1,
        game_id: game_id
    }
    }).then(result =>{
        
        // update info
        var url = result.get('url')
        var serviceID = result.get('serviceID')
        let filepath = result.get('lockfile_path')
        let params = {
            serviceID: serviceID,
            active: true
        }
        var str = JSON.stringify(params)
        fs.writeFile(filepath,str,function(err){
            if(err){
                return res.json({status: 'error', code:2, msg: 'Wrong In Path, please contact manager'}) 
            }
        })

        updateServiceRecord(serviceID, function(output){
            // console.log("success !!!")
            if(output){
                return res.json({status:'success', code:0, msg:{serviceURL:url, accAmount:new_acc}})
            }else{
                return res.json({status:'error', code:2, error: "Error in fetching available service, Please Contact"})
            }
        })
        
    }).catch(error =>{
        return res.json({status:'error', code:2, error: "Error in fetching available service, Please Contact"})
    })
}

// Add new game to db
app.post('/addNewGame', function(req, res){
    var gameID = req.body.gameID || ''
    var picurl = req.body.picurl || ''
    Games.create({gameID, picurl})
      .then(ok => res.json({status: 'ok'}))
      .catch(e => res.json({status: 'error', msg: e}));
})
// Create new game services
app.post('/addNewService', function(req, res){
    // serviceID url available currentuser game_id
    var serviceID = req.body.serviceID || ''
    var url = req.body.url || ''
    var available = 1
    var currentUser = ""
    var game_id = req.body.game_id || ''
    var lockfile_path = req.body.lockfile_path || ''
    if(serviceID && url && game_id){
        dataSet = {serviceID, url, available, currentUser, game_id, lockfile_path}
        Service.create(dataSet)
              .then(ok => res.json({status: 'ok'}))
              .catch(e => res.json({status: 'error', msg: e}));
    }else{
        return res.json({err:"Information Empty Somewhere"})
    }
    
})


// listen port
app.listen(PORT,HOST, () => console.log('Running on http://%s:%s', HOST, PORT))

