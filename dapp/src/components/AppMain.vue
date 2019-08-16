<template>
<el-container class='mainApp'>
    <el-aside v-show="drawer">
    <span>
      <el-button style="width:100%" @click="handleClose">Close MetaMask Info</el-button>
      <metaMaskSheet/>
    </span>
    </el-aside>
    <el-main>
      <gameDemo/>
    </el-main>
</el-container>
</template>

<script>
import MetaMaskSheet from '@/components/MetaMaskSheet'
import GameDemo from '@/components/GameDemo'
/* eslint-disable */
export default {
  name: 'mainApp',
  data(){
    return {
      drawer:true,
      direction: 'rtl',
    }
  },
  beforeCreate () {
    this.$store.dispatch('registerWeb3')
  },
  methods:{
    handleClose(done) {
        this.$confirm('Close The Drawer?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
          .then(_ => {
            this.drawer = false;
            done();
          })
          .catch(_ => {});
    }
  },
  components: {
    'metaMaskSheet': MetaMaskSheet,
    'gameDemo': GameDemo
  }
}
</script>

<style scoped>
html,body,#app {width: 100%;height: 100%;}
.el-container{
  width: 100%;
  height: 100%;
}
.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    width:40%;
  }
.el-main {
    background-color: lightgray;
    color: #333;
    text-align: center;
    line-height: 60%;
  }
</style>
