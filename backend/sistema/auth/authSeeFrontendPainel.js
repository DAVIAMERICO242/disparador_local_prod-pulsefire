const is_user_auth_to_see_painel_router = require('express').Router()
const jwt = require('jsonwebtoken');
const secretKey = 'yJNIDJ8329D0'; // Change this to a secure random key
require('dotenv').config();


//isso e para proteger rota no frontend
is_user_auth_to_see_painel_router.get('/private_route', (req,res)=>{
    console.log('erro ?')
    const token = req?.headers['token'];
    if(!token){
        res.status(404).send('NAO AUTORIZADO')
        return
    }else{
        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.status(403).end();
            console.log('rota privada autorizada')
            res.status(200).end()
        });
    }
})

module.exports={
    is_user_auth_to_see_painel_router
}