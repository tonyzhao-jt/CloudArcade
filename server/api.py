import requests as r
import json
# # add new game
def add_new_game():
    params = {
        "gameID": "SuperMario",
        "picurl": 'https://i.ytimg.com/vi/ksHdJvxPrjs/hqdefault.jpg'
    }
    content = r.post('http://127.0.0.1:7000/addNewGame', params)

# params = {
#     "game_id" : "1",
#     "user_account":"adasd"
# }


# content = r.post('http://127.0.0.1:7000/getServiceCrowdness', params)
# print(content.text)

def getEvent():
    url = 'https://api-rinkeby.etherscan.io/api?module=logs&action=getLogs'
    params_ = {
        "fromblock" : 0,
        "toBlock": "latest",
        "address": '0x44A9D17E868186dFea4D2798b307D39692716a38',
        "topic0": '0x65adfbd8b95db8cf4236cb2241c735e0b147ba0b912d34f7de046692f9db3b43',
        "topic0_transactionHash_opr": "and",
        "transactionHash": "0xa60a35acc4da3b3970cc9d1ceb11f13f62abf30808f7c3d26fd845fe48c5b685",
        "apikey" : 'S8MD5THU86R9YCS3T1763299WDU9YKPRGG'
    }

    rr = r.post(url, params_)
    result = json.loads(rr.text)['result']
    print(result[0]['data'][29:65]) 

def getReceipt():

    url = 'https://api-rinkeby.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt'
    # url = 'https://api-rinkeby.etherscan.io/api?module=transaction&action=eth_getTransactionReceipt'
    txhash= '0xa60a35acc4da3b3970cc9d1ceb11f13f62abf30808f7c3d26fd845fe48c5b685'
    apikey= 'S8MD5THU86R9YCS3T1763299WDU9YKPRGG'
    returns = r.post(url, {"txhash":txhash, "apikey":apikey})
    print(returns.content)

# getEvent()
# getReceipt()
add_new_game()
# add_new_game()

# print(len('0x00000000000000000000000000'))