require('dotenv').config();
const fetch = require('node-fetch');
const WPPAPI_URL = (process.env.PROD_ENV==='TRUE')?(`https://${process.env.WPPAPI_PROXY}`):(`http://localhost:${process.env.WPPAPI_PORT}`);


const WppDeleteConnection = async(connection_name, user_name)=>{
    const headers0 = {
        'accept': 'application/json',
        'apikey': `${process.env.WPPAPI_KEY}`,
        'Content-Type': 'application/json'
      };

    const server_connection_name = user_name?.toString() + '_' + (connection_name?.replace(/\s+/g, ' ')?.trim())?.toString();
    await fetch(`${WPPAPI_URL}/instance/logout/${server_connection_name}`, {//deletar antes
        method: 'DELETE',
        headers: headers0
      });
    const is_deleted_resp = await fetch(`${WPPAPI_URL}/instance/delete/${server_connection_name}`, {
        method: 'DELETE',
        headers: headers0
      });

    const is_deleted = await is_deleted_resp.json()
    console.log('STATUS DA CONEXÃO')
    console.log(is_deleted)
    return is_deleted
}

module.exports={
  WppDeleteConnection
}