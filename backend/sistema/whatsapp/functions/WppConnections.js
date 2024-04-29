require('dotenv').config();
const fetch = require('node-fetch');
const WPPAPI_URL = (process.env.PROD_ENV==='TRUE')?(`https://${process.env.WPPAPI_PROXY}`):(`http://localhost:${process.env.WPPAPI_PORT}`)

const WppConnections = async()=>{
    const headers = {
        'accept': 'application/json',
        'apikey': `${process.env.WPPAPI_KEY}`,
        'Content-Type': 'application/json'
      };
    const response_connections = await fetch(`${WPPAPI_URL}/instance/fetchInstances`, {
        method: 'GET',
        headers: headers
      });
    console.log(response_connections)
    const data_connections = await response_connections.json()
    var connections = data_connections.map((element,index)=>{
        if(element.instance?.status=='open'){
            return (element.instance?.instanceName)
        }
      })
    var connections = connections.filter((e,i)=>e)
    console.log('CONEXÕES')
    console.log(connections)
    return connections
  }

module.exports={
  WppConnections
}