<template>
 <div class='metaMaskSheet'>
    <el-container>
      <el-header style="font-size:Extra large;">
        MetaMask Status
        <el-tag :type="web3.isInjected? 'success': 'warning'">Metamask is {{web3.isInjected? 'Injected': 'Not Injected'}}</el-tag>
      </el-header>
       <el-main>
         <el-tag type="info">Account: {{ web3.coinbase }}</el-tag>
          <el-tag type="info">Balance: {{ web3.balance }}</el-tag>
          <el-tag type="danger">Network: {{ web3.networkId }}</el-tag>
       </el-main>
    </el-container>
    <!-- instruction -->
    <el-dialog
    title="Instruction"
    :visible.sync="web3.isInjected?false:dialogVisible"
    width="30%">
    <span>Metamask injection failed, Please check Whether you have the metamask plug in.</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="refreshPage">Refresh The Page</el-button>
    </span>
    </el-dialog>
 </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'metaMaskSheet',
  data(){
    return {
      dialogVisible : true
    }
  },
  computed: {
    web3 () {
      return this.$store.state.web3
    },
  },
  methods:{
    refreshPage(){
      this.$router.go(0)
      this.dialogVisible = false
    },
  }
}
</script>
<style scoped>
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    width: 100%;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 40%;
  }
</style>
