import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import Select from '@mui/material/Select';
import {useState, useEffect,useRef} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { GiPadlockOpen } from "react-icons/gi";
import { FaFilter } from "react-icons/fa";
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
const BACKEND_URL = (import.meta.env.VITE_PROD_ENV==='TRUE')?(`https://${import.meta.env.VITE_BACKEND_PROXY}`):(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}`);







export const WoocDialog = ({openWoocPreview,setFinalWoocData, isWoocDialogOpen,openWoocDialog,closeWoocDialog,woocSite,setWoocSite,woocConsumerKey,setWoocConsumerKey,woocConsumerSecret,setWoocConsumerSecret,woocStartDate,setWoocStartDate,woocEndDate,setWoocEndDate,woocOrderStatus,setWoocOrderStatus}) => {
    const validateError = useRef('');
    const [requestingWoocData, setRequestingWoocData] = useState(null);
    const [invalidWoocDialogFields,setInvalidWoocDialogFields] = useState([]);
    const [httpError,setHttpError] = useState(null);
    const [woocSuccess, setWoocSuccess] = useState(null);

    useEffect(()=>{//cache
        setWoocSite(localStorage.getItem('site'))
        setWoocConsumerKey(localStorage.getItem('consumer_key'))
        setWoocConsumerSecret(localStorage.getItem('consumer_secret'))
        setWoocStartDate(localStorage.getItem('start_date'))
        setWoocEndDate(localStorage.getItem('end_date'))
        setWoocOrderStatus((localStorage.getItem('order_status'))?(localStorage.getItem('order_status')):'any')
    },[])
    
    const validateUrl = (url) => {
        const regex = /^[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(:[0-9]+)?(\/.*)?$/;
        return regex.test(url?.replace(' ',''));
    };

    const validateString = (string)=>{
        return string?.replace(' ','')
    }

    const validateDate = (begin,end)=>{
        console.log('begin')
        console.log(begin)
        console.log('end')
        console.log(end)
        if(!begin || !end){
            return false
        }
        return new Date(end)>=new Date(begin)
    }

    const resetState = (e)=>{
        console.log('RESET STATE')
        setHttpError(null);
        setRequestingWoocData(null);
        if(e==='cancelled'){
            closeWoocDialog('cancelled');
        }else{
            closeWoocDialog();
        }
    }
    
    
    useEffect(()=>{
        console.log('debug 745')
        console.log(invalidWoocDialogFields)
        setHttpError(null);
        if(validateError.current){
            console.log('haha')
            validateError.current.style.display = 'none';
        }
        console.log([...new Set(invalidWoocDialogFields)])
        if(!validateUrl(woocSite)){
            if(!(invalidWoocDialogFields.includes('Seu site'))){
                setInvalidWoocDialogFields((prev)=>[...prev,'Seu site'])
            }
        }else{
            setInvalidWoocDialogFields((prev)=>prev.filter((e)=>e!=='Seu site'))
        }

        if(!validateString(woocConsumerKey)){
            if(!(invalidWoocDialogFields.includes('consumerKey'))){
                setInvalidWoocDialogFields((prev)=>[...prev,'consumerKey'])
            }
        }
        else{
            setInvalidWoocDialogFields((prev)=>prev.filter((e)=>e!=='consumerKey'))
        }

        if(!validateString(woocConsumerSecret)){
            if(!(invalidWoocDialogFields.includes('consumerSecret'))){
                setInvalidWoocDialogFields((prev)=>[...prev,'consumerSecret'])
            }
        }
        else{
            setInvalidWoocDialogFields((prev)=>prev.filter((e)=>e!=='consumerSecret'))
        }

        if(!validateDate(woocStartDate,woocEndDate)){
            if(!(invalidWoocDialogFields.includes('Data'))){
                setInvalidWoocDialogFields((prev)=>[...prev,'Data'])
            }
        }else{
            setInvalidWoocDialogFields((prev)=>prev.filter((e)=>e!=='Data'))
        }

        console.log([woocSite, woocConsumerKey, woocConsumerSecret, woocStartDate, woocEndDate, woocOrderStatus])
    },[woocSite, woocConsumerKey, woocConsumerSecret, woocStartDate, woocEndDate, woocOrderStatus])

    const requestWoocommerceData = async ()=>{
        setHttpError(null);
        setWoocSuccess(null);
        try{
            if(invalidWoocDialogFields.length){
                validateError.current.style.display = 'block';
                return;
            }
            var token = localStorage.getItem('token');
            setRequestingWoocData(true);
            var orders = await axios.get(`${BACKEND_URL}/woocommerce_orders?site=${woocSite}&start_date=${woocStartDate}&end_date=${woocEndDate}&order_status=${woocOrderStatus}`,{
                headers:{
                    'token':token,
                    'consumerKey':woocConsumerKey,
                    'consumerSecret':woocConsumerSecret
                }
            })
            setWoocSuccess(true);
            localStorage.setItem('site',woocSite);
            localStorage.setItem('consumer_key',woocConsumerKey);
            localStorage.setItem('consumer_secret',woocConsumerSecret);
            localStorage.setItem('start_date',woocStartDate);
            localStorage.setItem('end_date',woocEndDate);
            localStorage.setItem('order_status',woocOrderStatus);
            setRequestingWoocData(false);
            setFinalWoocData(orders.data)
        }catch(error){
            setWoocSuccess(false);
            setRequestingWoocData(false);
            console.log('Errored')
            if(error.response.status===404){
                console.log('ernt')
                setHttpError('Erro! Verifique os dados preenchidos e tente novamente')
            }else{
                setHttpError('Erro no servidor 500!')
            }
        }
        // closeWoocDialog();
    }
  
    return (
    <div>
        <FormControl size="small">
            <Dialog
            onBackdropClick="false"
            disableEscapeKeyDown = {true}
            id="oi"
            maxWidth="sm"   
            fullWidth
            open={isWoocDialogOpen}
            onClose={resetState}
            PaperProps={{
            component: 'form'
            }}>
                <DialogTitle>Configurar woocommerce</DialogTitle>
                <DialogContent>
                    <div className="test_flex">
                            <div>
                                <div className="label_555"><GiPadlockOpen/><div>Autorizar integração*</div></div>
                                <div className={"api-config " + (requestingWoocData?"disabled":'')}>
                                    <div id="tutorial">Acesse seusite.com/wp-admin e depois {"(Woocommerce>Configurações>Avançado>Api Rest> Gerar chave)"}</div>
                                    <div className="flex_aux6">
                                        <div className="select_wooc_label">Seu site (sem https):</div>
                                        <TextField defaultValue={(localStorage.getItem('site'))?(localStorage.getItem('site')):''} size="small" onChange={(e)=>setWoocSite(e.target.value)} label="example.com.br" className="generic_painel_input"/>
                                    </div>

                                    <div className="flex_aux6">
                                        <div className="select_wooc_label">consumerKey:</div>
                                        <TextField defaultValue={(localStorage.getItem('consumer_key'))?(localStorage.getItem('consumer_key')):''} size="small" onChange={(e)=>setWoocConsumerKey(e.target.value)} label="1° chave API" className="generic_painel_input"/>
                                    </div>

                                    <div className="flex_aux6">
                                        <div className="select_wooc_label">consumerSecret:</div>
                                        <TextField defaultValue={(localStorage.getItem('consumer_secret'))?(localStorage.getItem('consumer_key')):''} size="small" onChange={(e)=>setWoocConsumerSecret(e.target.value)} label="2° chave API" className="generic_painel_input"/>
                                    </div>
                                </div>
                            </div>

                            <div>
                                    <div className="label_555"><FaFilter/> <div>Filtro de pedidos*</div></div>
                                    <div className={"request-data-config " + (requestingWoocData?"disabled":'')}>
                                        <div className="flex_aux6">
                                            <div className="select_wooc_label">Data inicial:</div>
                                            <input defaultValue = {localStorage.getItem('start_date')?localStorage.getItem('start_date'):""} className="date" type="date" onChange={(e)=>setWoocStartDate(e.target.value)} />
                                        </div>

                                        <div className="flex_aux6">
                                            <div className="select_wooc_label">Data final:</div>
                                            <input defaultValue = {localStorage.getItem('end_date')?localStorage.getItem('end_date'):""} className="date" type="date" onChange={(e)=>setWoocEndDate(e.target.value)}/>
                                        </div>

                                        <div className="flex_aux6">
                                            <div className="select_wooc_label">Status do pedido:</div>
                                            <Select id="order_status_selector" className="generic_painel_input" defaultValue = {woocOrderStatus ? ((localStorage.getItem('order_status')) ? localStorage.getItem('order_status') : woocOrderStatus) : 'any'} onChange={(e)=>setWoocOrderStatus(e?.target?.value)} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
                                                    <MenuItem value={'any'}>Qualquer</MenuItem>
                                                    <MenuItem value={'completed'}>Concluído</MenuItem>
                                                    <MenuItem value={'processing'}>Processando</MenuItem>
                                                    <MenuItem value={'cancelled'}>Cancelado</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                            </div>
                    </div>

                    <div ref={validateError} className="invalid_fields">Campos inválidos: {[...new Set(invalidWoocDialogFields)]?.join(', ')}</div>
                    {requestingWoocData?(<div className="wooc_progress">
                        <div>Esse processo pode levar alguns minutos, por favor não feche essa tela...</div>
                        <LinearProgress />
                    </div>):null}
                    {httpError?(<div className="http_error">{httpError}</div>):''}
                    {woocSuccess?(<div className="wooc_success">Pedidos carregados com sucesso <a href="#" onClick={openWoocPreview}>Preview</a></div>):null}
                    <div className="flex-wooc">
                        <button onClick={()=>resetState('cancelled')} id="cancel_wooc">Fechar</button>
                        <button onClick={requestWoocommerceData} id="ready_wooc" className={"ready_wooc " + (requestingWoocData?"disabled":'')}>Conectar</button>
                    </div>
                </DialogContent>
            </Dialog>
            </FormControl>
    </div>
  )
}


