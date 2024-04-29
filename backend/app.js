const app = require('express')();
const bodyParser = require('body-parser');
const {login_router} = require('./sistema/auth/login');
const {is_user_auth_to_see_painel_router} = require('./sistema/auth/authSeeFrontendPainel');
const {AuthBackendMiddleware} = require('./sistema/auth/authUseBackendAPI')
const {whatsapp_router} = require('./sistema/whatsapp/routes');
const {campaign_router} = require('./sistema/campaigns/routes');
const {woocommerce_router} = require('./sistema/woocommerce/routes');
const cors = require('cors'); // Import the CORS middleware
const FRONT_END_URL = (process.env.PROD_ENV==='TRUE')?(`https://${process.env.FRONTEND_PROXY}`):(`http://localhost:${process.env.FRONTEND_PORT}`)

//REQUER TABELA disparos com moment,user,campaign, truthy_connection, contact_name,target_number
//REQUER TABELA users com user,pass,tel,email

require('dotenv').config();


app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.use(cors({
    origin: FRONT_END_URL,
    credentials: true
  }));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',login_router);
app.use('/',is_user_auth_to_see_painel_router);


app.use('/',AuthBackendMiddleware, whatsapp_router);
app.use('/',AuthBackendMiddleware, campaign_router);
app.use('/',AuthBackendMiddleware, woocommerce_router);


app.listen(process.env.BACKEND_PORT,()=>{console.log(`escutando porta ${process.env.BACKEND_PORT}`)})