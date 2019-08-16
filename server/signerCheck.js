// this mimics the prefixing behavior of the eth_sign JSON-RPC method.
var abi = require('ethereumjs-abi')
var util = require('ethereumjs-util')
function constructPaymentMessage(contractAddress, amount) {
    return abi.soliditySHA3(
        ["address", "uint256"],
        [contractAddress, amount]
    );
}
function prefixed(hash) {
    return abi.soliditySHA3(
        ["string", "bytes32"],
        ["\x19Ethereum Signed Message:\n32", hash]
    );
}

function recoverSigner(message, signature) {
    var split = util.fromRpcSig(signature);
    var publicKey = util.ecrecover(message, split.v, split.r, split.s);
    var signer = util.pubToAddress(publicKey).toString("hex");
    return signer;
}

let isValidSignature = function(contractAddress, amount, signature, expectedSigner) {
    var message = constructPaymentMessage(contractAddress, amount);
    var signer = recoverSigner(message, signature);
    console.log(signer)
    console.log(util.stripHexPrefix(expectedSigner))
    return signer.toLowerCase() ==
        util.stripHexPrefix(expectedSigner).toLowerCase();
}

module.exports.isValidSignature = isValidSignature