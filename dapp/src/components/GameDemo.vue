<template>
  <div class="demo">
    <h1>CloudArcade</h1>
    <h4>Pick The Number of Game and Check The Corresponding Price
    </h4>
    <div class="light_box">
    <el-row type="flex" style="padding: 10px;">
    <el-col :span="9" v-for="(game,i) in games_available" :key="i">
      <el-card :body-style="{ padding: '0px' }" style="margin:0.3em;" shadow="hover">
        <div style='padding:10px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);'>{{ game.gameID }}</div>
        <el-image
        style="width: 15em; height: 15em; margin-top:1em;"
        :src="game.picurl"
        fit="fill"></el-image>
        <el-row :gutter="20" type="flex" style="padding: 14px;">
          <el-col :span="8"><div style="font-family: Helvetica Neue; font-size:0.7em; padding-top:0.5em;">CROWDNESS</div></el-col>
          <el-col :span="15"><div><el-progress :text-inside="true" :stroke-width="22" :percentage="handler(gameStatus, i)"></el-progress>
          </div></el-col>
        </el-row>
        <el-row :gutter="20" type="flex" style="padding: 0.2em;">
          <el-col :span="3"><div style="font-family: Helvetica Neue; font-size:2em; padding-top:0.2em; padding-left:0.6em;">{{gamePrices[i]}}</div></el-col>
          <el-col :span="5"><div style="padding-top:0.8em;">Ether</div></el-col>
          <el-col :span="8"><el-button class="button" style="width:14em;" v-on:click="clickPayment(i)" type="primary" :loading="button_.btn_loading" :disabled="false">Purchase Game</el-button></el-col>
        </el-row>
      </el-card>
      </el-col>
    </el-row>
    </div>
    <div class="light_box">
    <el-row :gutter="20" type="flex" style="padding: 1em;">
      <el-col :span="5"><div style="font-family: Helvetica Neue; font-size:0.8em; padding-top:1em;">Current Channel Address</div></el-col>
      <el-col :span="7"><el-input v-model="paymentChannelAddress" placeholder="Current Channel Address" :disabled="true"></el-input></el-col>
      <el-col :span="5"><el-button :loading="button_.deploy_loading" @click='deploy_channel'>Deploy New Channel</el-button></el-col>
      <el-col :span="5"><el-button :loading="button_.getchannel_loading" @click='get_channel_info'>Get Previous Created Payment Channel</el-button></el-col>
    </el-row>
    <el-row :gutter="20" style="padding: 1em;">
      <el-col :span="5">
        <div style="font-family: Helvetica Neue; font-size:0.8em;">Current Price You paid:</div>
      </el-col>
      <el-col :span="3">
        <div>{{accAmount}} Ether</div>
      </el-col>
    </el-row>
    </div>
    <div class = 'text-align:center; height:40px;'>
      <img v-if="pending" id="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif">
    </div>
    
    
  </div>
</template>

<script>
/* eslint-disable */
import deployChannel from '../util/channelDeploy'
import signer from '../util/web3Signer'
export default {
  name: 'demon',
  data () {
    return {
      pending: false,
      winEvent: null,
      transactionOver: false,
      chosenGame: 0,
      games_available:null,
      activeNames: ['1'],
      button_:{
        btn_loading: false,
        deploy_loading: false,
        getchannel_loading:false,
      },
      gameStatus: null,
      url:null,
      paymentChannelAddress: "",
      accAmount:0,
      gamePrices:null
     
    }
  },
  computed:{
  },
  sockets: {
    connect: function () {
        console.log('socket connected')
    },
    // Games info, Price info will be updated by others action
    gameInfo: function (data) {
      if(data.code == 2){
        this.$message.error('Fail to Get Games info from GaaS')
      }
      this.games_available = data.result.games_info
      this.gameStatus = data.result.crowdness_info
      console.log("gameInfo", data)
    },
    priceUpdate:function (data) {
      console.log(data)
    }
  },

  created(){
    this.serverURL = 'http://127.0.0.1:7000',
    this.getGamesInfo()
  },
  methods: {
    // Payment Channel Part
    // Get Channel Information For the Current User
    get_channel_info(){
      this.button_.getchannel_loading = true
      this.$http.post(this.serverURL + '/getPaymentChannelAddress',{player_address:this.$store.state.web3.coinbase},{emulateJSON: true , timeout:10000})
      .then((data)=>{
        console.log(data)
        if(data.body.code == 2){
        this.$message.error('No Channel Info Detected')
        this.button_.getchannel_loading = false
      }
        this.paymentChannelAddress = data.body.msg.address
        this.accAmount = data.body.msg.accumulatedAmount
        this.button_.getchannel_loading = false
      })
    },
    // send payment channel to server
    sendPaymentChannel(player_address, paymentChannelAddress){
      this.$http.post(this.serverURL + '/newPaymentChannelCreated',
      {
        player_address: player_address,
        new_channel_address: paymentChannelAddress
      },{emulateJSON: true , timeout:10000})
      .then((data)=>{
        if(data.body.code == 2){
        this.$message.error(data.body.msg)
        }else{
          this.$message({
          message: 'Successfully Built The Payment Channel',
          type: 'success'
          });
        }
      })
    },
    // Deploy the Payment Channel If needed
    deploy_channel(){
      this.button_.deploy_loading = true
      deployChannel(this.$store.state.web3.coinbase, (result =>{
        if(result){
          console.log("contract result", result)
          this.sendPaymentChannel(this.$store.state.web3.coinbase, result)
          this.paymentChannelAddress = result
          this.button_.deploy_loading = false
        }else{
          this.$message.error('Problems in Deploy Payment Channel')
          this.button_.deploy_loading = false
        }
      }))
    },
    // Get Games Information From Server
    getGamesInfo(){
      this.$http.get(this.serverURL + '/getAllGames',{emulateJSON: true , timeout:10000})
      .then((data)=>{
        if(data.body.code == 2){
        this.$message.error('Fail to Get Games info from GaaS')
        }
        this.games_available = data.body.result.games_info
        this.gameStatus = data.body.result.crowdness_info
        this.gamePrices = data.body.result.price_info
        console.log(data)
      })
    },
    signPayment(game_id, amount){
      signer(this.$store.state.web3.coinbase,this.paymmentChannelAddress, amount, (signed_message=>{
        console.log(signed_message)
      }))
    },

    handler(gameStatus, i){
      if(gameStatus){
        let length = gameStatus.length
        if(i < length){
          return ((gameStatus[i].total - parseInt(gameStatus[i].totalAvailable, 10)) / gameStatus[i].total) * 100
        }
        else{
          return 100
        }
      }else{
        return 100
      }   
    },

    clickNumber (game_id) {
        this.getGammesStatus()
        console.log("gameid", game_id + 1)
        this.chosenGame = game_id + 1
        this.pending = true
        this.$store.state.contractInstance().methods.returnPrice(this.chosenGame).call({ from : this.$store.state.web3.coinbase })
      .then(result=>{
        console.log(result)
        this.amount = parseInt(result, 10)
        this.pending = false
      }, error=>{
        this.$message.error('Fail to get game price from the smart contract')
        console.log(error)
      })
      
    },

    clickReset(){
      this.chosenGame = null
    },


    // post signature
    postSignature(payerAddress, signature, contract_address, game_id){
      this.$http.post(this.serverURL + '/postSignature',
      {
        payerAddress: payerAddress,
        signature: signature,
        contract_address:contract_address,
        game_id:game_id
      },{emulateJSON: true , timeout:10000})
      .then((data)=>{
        if(data.body.code == 2){
        this.$message.error(data.body.msg)
        }else{
          this.$message({
          message: 'Successfully Generated And Send Message',
          type: 'success'
          });
        }
      })
    },

    // Payment Button Clicked
    clickPayment (id) {
      let price = this.gamePrices[id]
      if(this.paymentChannelAddress){
        this.btn_loading = true
        let new_acc_price = this.accAmount + price
        // console.log("price", new_acc_price, this.paymentChannelAddress)
        signer(this.paymentChannelAddress, new_acc_price, (signature)=>{
          // console.log("签名", signature)
          console.log(signature)
          if(!signature){
            return this.$message.error('No Payment Channel Detected!')
          }
          this.accAmount = new_acc_price
          this.postSignature(this.$store.state.web3.coinbase, signature, this.paymentChannelAddress, id)
        })
      }else{
        this.$message.error('No Payment Channel Detected!')
      }
      
    }
  },
  mounted () {
    console.log('dispatching getContractInstance')
    this.$store.dispatch('getContractInstance')
  }
}
</script>
<style scoped>
.light_box{
   box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
   font-size: 20px;
}
body {
    margin: 0;
}
.casino {
     margin-top: 50px;
     text-align:center;
}
#loader {
  width:150px;
}

.sc-condition{
  height: 50px;
  width: 100%;
}

</style>
