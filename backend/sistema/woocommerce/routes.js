require('dotenv').config();
const woocommerce_router = require('express').Router()
const {getWoocAllCustomersData} = require('./woocommerce');


woocommerce_router.get('/woocommerce_orders', async (req,res)=>{
    try{
      const token = req.token;
      const user_name = req.user_name;
      console.log('SITE')
      console.log(req.query)
      const site = 'https://' + req.query?.site?.replace(' ','');
      console.log('debug')
      const consumerKey = req.headers['consumerkey']?.replace(' ','');
      const consumerSecret = req.headers['consumersecret']?.replace(' ','');
      const {start_date} = req.query;
      const {end_date} = req.query;
      const {order_status} = req.query;
      console.log('HEADERS');
      console.log(req.headers);
      console.log([site,consumerKey,consumerSecret,start_date,end_date,order_status]);

      var orders = await getWoocAllCustomersData(site, consumerKey, consumerSecret, start_date, end_date, order_status);

      if(!orders){
        res.status(404).end();
      }else{
        res.status(200).send(orders);
      }  
    }catch(error){
      console.log(error)
      res.status(500).end()
    }
  
  })

module.exports={
    woocommerce_router
}