import Web3 from 'web3'
import {address, ABI} from './constants/contractInfo'
let getContract = new Promise(function (resolve, reject) {
  let web3 = new Web3(window.web3.currentProvider)
  let casinoContractInstance = new web3.eth.Contract(ABI, address)
  // casinoContractInstance = () => casinoContractInstance
  resolve(casinoContractInstance)
})
export default getContract
