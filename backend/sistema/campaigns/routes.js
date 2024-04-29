require('dotenv').config();
const campaign_router = require('express').Router()
const {Campaigns,DeleteCampaigns, AllCampaignColumns} = require('./manage_database_campaigns')

campaign_router.get('/whole_campaigns', async (req,res)=>{
  try{
    const user_name = req.user_name;
    const campaigns = req.query.campaigns;
    console.log('CHEGOU NO BACKEND ASSIM:')
    console.log(campaigns)
    if(!campaigns){
      res.status(400).end();
    }
    const campaigns_data = await AllCampaignColumns(user_name, campaigns);
    res.status(200).send(campaigns_data);
  }catch{
    res.status(500).end();
  }
})

campaign_router.post('/delete_campaigns', async (req,res)=>{
  try{
    const user_name = req.user_name;
    const campaigns = req.body.campaigns;
    if(!AllCampaignColumns){
      res.status(400).end();
    }
    await DeleteCampaigns(user_name, campaigns);
    res.status(200).end();
  }catch{
    res.status(500).end();
  }
});


campaign_router.get('/campaigns', async (req,res)=>{
    try{
      const user_name = req.user_name;
      const token = req.token;
      const campaigns = await Campaigns(user_name);
      console.log('CAMPAIGN NAME')
      console.log(campaigns);
      res.status(200).send(campaigns);
    }catch{
      res.status(500).end()
    }
  });
  
module.exports={
    campaign_router
}