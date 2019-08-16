/* eslint-disable */
var abi = require('ethereumjs-abi')
function constructPaymentMessage(contractAddress, amount) {
    return abi.soliditySHA3(
        ["address", "uint256"],
        [contractAddress, amount]
    );
}

function signMessage(message, callback) {
    // get web3
    var web3
    // Modern DApp Browsers
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try { 
        window.ethereum.enable().then(function() {
            // User has allowed account access to DApp...
        });
        } catch(e) {
        // User has denied account access to DApp...
        }
    }
    // Legacy DApp Browsers
    else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    }
    let version = web3.version.api.substring(0,1)
    if(version < 1){
        web3.eth.sign(
            web3.eth.defaultAccount,
            "0x" + message.toString("hex"),
            function(error, result){
                if(!error){
                    console.log(result)
                    callback(result)
                }else{
                    console.log(error)
                }
                
            }
        )
       
    }else{
        web3.eth.sign(
            "0x" + message.toString("hex"),
            web3.eth.defaultAccount,
            function(error, result){
                if(!error){
                    console.log(result)
                    callback(result)
                }else{
                    console.log(error)
                }
                
            }
        )
    }
    
}

// contractAddress is used to prevent cross-contract replay attacks.
// amount, in wei, specifies how much Ether should be sent.

function signPayment(contractAddress, amount, callback) {
    var message = constructPaymentMessage(contractAddress, amount);
    signMessage(message, callback)
}

export default signPayment