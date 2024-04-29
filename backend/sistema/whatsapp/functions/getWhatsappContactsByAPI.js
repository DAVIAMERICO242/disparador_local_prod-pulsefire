require('dotenv').config();
const fetch = require('node-fetch');
const WPPAPI_URL = (process.env.PROD_ENV==='TRUE')?(`https://${process.env.WPPAPI_PROXY}`):(`http://localhost:${process.env.WPPAPI_PORT}`);

const getWhatsappContactsByAPI = async(connection_name, user_name)=>{
    const server_connection_name = user_name?.toString() + '_' + (connection_name?.replace(/\s+/g, ' ')?.trim())?.toString();
  
    const headers0 = {
      'accept': 'application/json',
      'apikey': `${process.env.WPPAPI_KEY}`,
      'Content-Type': 'application/json'
    };
  
    try{
      const contacts = await fetch(`${WPPAPI_URL}/chat/findContacts/${server_connection_name}`, {
        method: 'POST',
        headers: headers0
      });
      const contacts_phones = []
      const contacts_data = await contacts.json()
      contacts_data.map((element,index)=>{
        contacts_phones.push({'nome':element.pushName,'phone':element.id})
      })
      return contacts_phones.filter(e=>e)
    }catch(error){
      console.log(error)
    }
  
  }

module.exports={
  getWhatsappContactsByAPI
}