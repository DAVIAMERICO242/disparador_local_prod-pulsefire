
const jwt = require('jsonwebtoken');
const secretKey = 'yJNIDJ8329D0'; // Change this to a secure random key

const AuthBackendMiddleware = (req,res,next)=>{
    const token = req?.headers['token'];
    if(!token){
      console.log('TOKEN NAO ENCONTRADO');
      return res.status(400).end();
    }
    try{
        const decoded = jwt.verify(token, secretKey);
        const user_name = decoded.username;
        req.user_name = user_name
        req.token = token
        next();
    }catch{
        console.log('NAO AUTORIZADO APESAR DE POSSUIR TOKEN')
        return res.status(400).end();
    }
}

module.exports={
    AuthBackendMiddleware
}