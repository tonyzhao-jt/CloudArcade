/* eslint-disable */
var ABI = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "game_id",
				"type": "uint256"
			}
		],
		"name": "returnPrice",
		"outputs": [
			{
				"name": "price",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "payer",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "returnTransferMoney",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "game_id",
				"type": "uint256"
			}
		],
		"name": "moneyTransfer",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "emergencyCashOut",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "returnMoneyEmergency",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "transferFixedCost",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "moneyToOwner",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "receiver",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "p_owner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "payer",
				"type": "address"
			}
		],
		"name": "TransferEnd",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ReceiverJoined",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amountInWei",
				"type": "uint256"
			}
		],
		"name": "PayOutSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "payer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "game_id",
				"type": "uint256"
			}
		],
		"name": "GamePayOutSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "EmergencyCashOut",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnerReceive",
		"type": "event"
	}
]
const address = '0x44A9D17E868186dFea4D2798b307D39692716a38'
export {address, ABI}
