import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {useState,useRef, useEffect} from 'react'
import './logged.css';
import * as XLSX from 'xlsx';
import { FaRegClock } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import {WoocPreview} from "./WoocPreview";
import {WoocDialog} from "./WoocDialog";
import { GrConfigure } from "react-icons/gr";
import {ExcelDialog} from './ExcelDialog';
import { SiWoocommerce } from "react-icons/si";
import { IoTrashBin } from "react-icons/io5";
import { TextField } from '@mui/material';
import { FaRegEye } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { IntervalDisparoDialog } from './IntervalDisparoDialog';
import { TbMessageCircleCog } from "react-icons/tb";
import {SetMessageUI} from "./SetMessageUI";
import { toast, ToastContainer } from 'react-toastify';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import "react-toastify/dist/ReactToastify.css";
import Slider from '@mui/material/Slider';
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { RiFileExcel2Fill } from "react-icons/ri";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios'
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { GoCheckCircleFill } from "react-icons/go";
import {ExcelPreview} from './ExcelPreview'
import CircularProgress from '@mui/material/CircularProgress';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const BACKEND_URL = (import.meta.env.VITE_PROD_ENV==='TRUE')?(`https://${import.meta.env.VITE_BACKEND_PROXY}`):(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}`);
const WEBSOCKET_URL = (import.meta.env.VITE_PROD_ENV==='TRUE')?(`wss://${import.meta.env.VITE_WEBSOCKET_PROXY}`):(`ws://localhost:${import.meta.env.VITE_WEBSOCKET_PORT}`);




export const DisparadorUI = ({disparoState, setDisparoState}) => {
  ////todos estados referentes a cache ou UX e dialogos
  console.log('CACHE DO DISPARO:')
  console.log(disparoState)
  if(disparoState!=='sim'){
    localStorage.setItem('isDisparing',false);
  }else{
    localStorage.setItem('isDisparing',true);
  }

  const [loadingMax,setLoadingMax] = useState(null);
  const [historicConnections, setHistoricConnections] = useState(null);
  const [historicCampaigns, setHistoricCampaigns] = useState(null);
  const [isDisparing, setIsDisparing] = useState(null);
  // localStorage.setItem('isDisparing',isDisparing); tem que ta fora mesmo kkk
  const [disparoProgress, setDisparoProgress] = useState('-/-');
  const [fails, setFails] = useState(0);
  const [success, setSuccess] = useState(null);
  const [totalDispared, setTotalDispared] = useState(0);
  const [paused, setPaused] = (localStorage.getItem('paused'))?((localStorage.getItem('paused')==='true')?useState(true):useState(false)):useState(false);
  const [stoped, setStoped] = useState(false);//SEM LOCALSTORAGE
  const [isIntervalDialogOpen, setIsIntervalDialogOpen] = useState(null);
  const [isWoocDialogOpen, setIsWoocDialogOpen] = useState(null);
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(null);
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
  const [isConfigMessageDialogOpen, setIsConfigMessageDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(true);
  const [acompanharDialogOpen, setAcompanharDialogOpen] = useState(true);
  const [UIStop,setUIStop] = useState(false);
  ////Estados referentes a validação e valor dos campos
  //woocommerce
  const [fileType,setFileType] = useState(null);
  const [lowerIntervalLimit,setLowerIntervalLimit] = useState(12);//2727
  const [upperIntervalLimit, setUpperIntervalLimit] = useState(20);
  const [pseudoPauseLowerLong, setPseudoPauseLowerLong] = useState(40);
  const [pseudoPauseUpperLong, setPseudoPauseUpperLong] = useState(60);
  const [numberToTriggerPseudoPause, setNumberToTriggerPseudoPause] = useState(20);
  const [finalWoocData, setFinalWoocData] = useState(null);
  const [isWoocPreviewOpen,setIsWoocPreviewOpen] = useState(null);

  const [woocSite, setWoocSite] = useState(null);
  const [woocConsumerKey, setWoocConsumerKey] = useState(null);
  const [woocConsumerSecret, setWoocConsumerSecret] = useState(null);
  const [woocStartDate, setWoocStartDate] = useState(null);
  const [woocEndDate, setWoocEndDate] = useState(null);
  const [woocOrderStatus, setWoocOrderStatus] = useState('any');
  //excel
  const [nomeColName,setNomeColName] = useState(null);
  const [phoneColName,setPhoneColName] = useState(null);
  const [finalExcelData, setFinalExcelData] = useState(null);
  const [JSexcelData,setJSexcelData] = useState(null);
  const [excelFileName, setExcelFileName] = useState(null);
  //demais..
  const [typeDisparo, setTypeDisparo] = useState('lista');
  const [campaign, setCampaign] = useState('');
  const [isCampaignValid, setIsCampaignValid] = useState(null);
  const [connection, setConnection] = useState('');
  const [isConnectionValid, setIsconnectionValid] = useState(null);
  const [selected_how_many_contacts, setSelected_how_many_contacts] = useState(5);
  const [isNumberOfContactsValid, setIsNumberOfContactsValid] = useState(true);
  const [restrictedCampaigns, setRestrictedCampaigns] = useState([]);
  const [isRestrictedCampaignValid,setIsRestrictedCampaignValid] = useState(true);
  const [MessageInParentComponent, setMessageInParentComponent] = useState('');
  const [isMessageValid, setIsMessageValid] = useState(false);
  const [image, setImage] = useState(null);
  //marcador de segundos aleatorios:
  const marks =[{
    value:5,
    label: '5 s'
  },
  {
    value:10,
    label: '10 s'
  },
  {
    value:15,
    label: '15 s'
  },
  {
    value:20,
    label: '20 s'
  }
  ]
  //adicional


  //handlers DE DIALOGOS
  const openWoocPreview = (e)=>{
    setIsWoocPreviewOpen(true);
  }

  const closeWoocPreview = (e)=>{
    setIsWoocPreviewOpen(false);
  }

  const openWoocDialog = (e)=>{
    setIsWoocDialogOpen(true);
  }

  const closeWoocDialog = (e)=>{
    setIsWoocDialogOpen(false);
  }

  const openExcelPreview = (e)=>{
    setIsExcelPreviewOpen(true)

  }

  const closeExcelPreview = (e)=>{
    setIsExcelPreviewOpen(false);
  }
  
  const openExcelDialog = (e)=>{
    e?.preventDefault();
    setIsExcelDialogOpen(true);
  }

  const closeExcelDialog = (e)=>{
    console.log('NOME e')
    console.log(e)
    if(nomeColName && phoneColName && e!=='cancelled'){
        console.log('Dados completos')
        console.log(JSexcelData)
        console.log('COLUNA NOME');
        console.log(JSexcelData.map((element)=>element[nomeColName]));
        var final_data = [];
        JSexcelData.forEach((element)=>{
          final_data.push({'nome':element[nomeColName],'phone':element[phoneColName]});
        }); 
        setFinalExcelData(final_data);   
        setIsExcelDialogOpen(false);
        toast.success("Configurações salvas com sucesso", {
          position: "top-center"
        });
    }else if(e==='cancelled'){
      setFinalExcelData(null);
      setExcelFileName(null);
      setJSexcelData(null);
      setNomeColName(null);
      setPhoneColName(null);
      setIsExcelDialogOpen(false);
    }
  }

  const openIntervalDialog = (e)=>{//2727
    console.log('intervalo dialogo')
    e.preventDefault();
    setIsIntervalDialogOpen(true)
  }

  const closeIntervalDialog = (e)=>{
    e.preventDefault();
    setIsIntervalDialogOpen(false);
    toast.success("Configurado com sucesso", {
      position: "top-center"
    });
  }

  const openConfigMessageDialog = (e)=>{
    e.preventDefault()
    setIsConfigMessageDialogOpen(true)
  }
  const closeConfigMessageDialog = (e)=>{
    e.preventDefault()
    setIsConfigMessageDialogOpen(false)
    console.log('valor da mensagem no componente pai AO FECHAMENTO DO DIALOGO (estado)')
    console.log(MessageInParentComponent)
    console.log('IMAGEM APOS O FECHAMENTO')
    console.log(image)

    if(MessageInParentComponent?.length>10 && MessageInParentComponent){
      setIsMessageValid(true);
      toast.success("Mensagem salva com sucesso", {
        position: "top-center"
      });
    }else{
      setIsMessageValid(false);
      toast.error("A mensagem deve ter pelomenos 10 caracteres", {
        position: "top-center"
      });
    }
  }
  const openSuccessDialog = (e)=>{
    e?.preventDefault();
    setSuccessDialogOpen(true);

  }

  const closeSuccessDialog = (e)=>{
    console.log('DIALOGO FECHADO')
    e?.preventDefault();
    setSuccessDialogOpen(false);
    setSuccess(false);
    setUIStop(false);
  }

  const closeAcompanharDialog = (e)=>{
    e?.preventDefault()
    if(!isDisparing && !(localStorage.getItem('isDisparing')==='true')){
      setAcompanharDialogOpen(false)
    }
  }

  //handlers gerais
  const cleanWooc = (e)=>{
    setFinalWoocData(null);
    setWoocSite(null);
    setWoocConsumerKey(null);
    setWoocConsumerSecret(null);
    setWoocStartDate(null);
    setWoocEndDate(null);
    setWoocOrderStatus(null);
  }

  const cleanExcel = (e)=>{
    setFinalExcelData(null);
    setExcelFileName(null);
    setJSexcelData(null);
    setNomeColName(null);
    setPhoneColName(null);
  }

  const handleChange_on_restricted_campaign = (event) => {
    console.log('DETECTANDO CONEXAO')
    console.log(event.target.value)
    setRestrictedCampaigns(event.target.value);
  };

  const handleNomeColNameChange = (e)=>{
    setNomeColName(e.target.value)
  }

  const handlePhoneColNameChange = (e)=>{
    setPhoneColName(e.target.value)
  }
  const handleExcelFileChange = (e)=>{
    const file = e.target.files[0];
    const file_name = file?.name;
    const extension = file_name.split('.').pop().toLowerCase();

    if (extension === 'xlsx') {
        // Process Excel file
        setExcelFileName(file_name)
        readExcelFile(file);
    }  
    
    else {
        alert('Please select a valid Excel (.xlsx) file.');
    }

  }

  const readExcelFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet);
        console.log(excelData[0])
        setJSexcelData(excelData);
        setExcelFileName(file.name);
        openExcelDialog();
    };

    reader.readAsArrayBuffer(file);
}

  const handleTypeDisparo = (e)=>{
    setTypeDisparo(e.target.value)
    console.log(e.target.value)
  }
  const handleLoadingMax = (e)=>{
    e?.preventDefault();
    setLoadingMax(true);
    if(!connection){
      alert('Selecione uma conexão');
    }
  }

  const handleImageFile = (val)=>{
    setImage(val)
    if(val){
      fileToBase64(val)
    }
  }

  function fileToBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      console.log(base64String); // Here's the base64 representation of the file
      setImage(base64String);
    };
  }

  const handleMessageValue = (val)=>{//essa função é passada como propriedade para DisparadorUI
    console.log('valor da mensagem no componente pai (bruto)')
    console.log(val);
    setMessageInParentComponent(val);
    console.log('valor da mensagem no componente pai (estado)')
    console.log(MessageInParentComponent)
  }

  const handleCampaignChange = (event) => {
    console.log('triggerado')
    setCampaign(event.target.value);
    console.log(campaign)
    event.target.value?((event.target.value!=0)?setIsCampaignValid(true):setIsCampaignValid(false)):setIsCampaignValid(false)
  }

  const handleConnectionChange = (event) => {
      setConnection(event.target.value);
      setSelected_how_many_contacts(5);
      if(event.target.value===""){
        console.log('conexao invalida')
        setIsconnectionValid(false)
      }else{
        console.log('conexao valida')
        setIsconnectionValid(true)
      }
  };

  const handleHowManyContactChange = (event) => {
    setSelected_how_many_contacts(event.target.value);
    console.log(selected_how_many_contacts)
    var try_int = parseInt(event.target.value)
    var check_number = (Number.isNaN(try_int))?false:(Number.isInteger(try_int) && (try_int > 0))
    console.log(!Number.isNaN(try_int))
    check_number?setIsNumberOfContactsValid(true):setIsNumberOfContactsValid(false)

    };



  const manageStop = (e)=>{
    setDisparoState(false);
    async function resetDisparoStateInBackendByUX(){
      const token = localStorage.getItem('token');
      await axios.get(`${BACKEND_URL}/stop_backend_disparing`,{
        headers: {
          'token': `${token}`,
          'Content-Type': 'application/json'
      }
      });
    }
    resetDisparoStateInBackendByUX();

    setStoped((prev)=>!prev)
    setUIStop(true)
  }

  const goPause = (e)=>{
    setPaused((prev)=>!prev);
    (localStorage.getItem('paused')==='true')?(localStorage.setItem('paused',false)):(localStorage.setItem('paused',true));
  }

  //useEFFECTS REFERENTES A UX E CACHE
  useEffect(()=>{
    console.log('FINAL EXCEL DATA');
    console.log(finalExcelData)
  },[finalExcelData])

  const refDisparo = useRef();

  useEffect(()=>{
    async function getIsUserBackendCache(){
        try{
          const token = localStorage.getItem('token')
          const backend_cache= await axios.get(`${BACKEND_URL}/user_cache`,{
            headers: {
              'token': `${token}`,
              'Content-Type': 'application/json'
          }
          });
          if(backend_cache?.data?.cache_is_disparing==='sim'){
            console.log('RODOU IS DISPARING UHUL')
            setIsDisparing(true);
            localStorage.setItem('isDisparing',true);
          }else{
            setIsDisparing(false);
            localStorage.setItem('isDisparing',false);
          }
          if(backend_cache?.data?.cache_pause_status==='paused'){
            setPaused(true);
            localStorage.setItem('paused',true);
          }else{
            setPaused(false);
            localStorage.setItem('paused',false);
          }
          if(backend_cache?.data?.cache_progress){
            setDisparoProgress(backend_cache?.data?.cache_progress);
          }else{
            setDisparoProgress('-/-');
          }
          if(backend_cache?.data?.cache_n_fails){
            setFails(backend_cache?.data?.cache_n_fails);
          }else{
            setFails(0);
          }
        }catch(error){
          console.log(error)
        }
    }
    getIsUserBackendCache();
  },[]);
    
    
  useEffect(()=>{
    console.log('A conexão é valid?')
    if((!isCampaignValid || !isConnectionValid || !((typeDisparo==='lista')?isNumberOfContactsValid:true)  || !isMessageValid)){
      refDisparo.current.style.opacity = 0.5
      refDisparo.current.style['pointer-events'] = 'none'

    }
    else{
      console.log('entrou no else')
      refDisparo.current.style.opacity = 1
      refDisparo.current.style['pointer-events'] = ''
    }
  },[isCampaignValid,isConnectionValid, isNumberOfContactsValid, isMessageValid, typeDisparo]);

  useEffect(() => {
    if (success) {
      openSuccessDialog(); // Open the dialog whenever success becomes true
    }
  }, [success, stoped]);

  ///useEffects referentes a requisições http e websockets:
  useEffect(()=>{
    async function getMax(){
      if(loadingMax && connection){
        try{
          console.log('conexao bugada')
          console.log(connection)
          const token = localStorage.getItem('token')
          const response_max = await axios.get(`${BACKEND_URL}/get_how_many?connection_name=${connection}`,{
            headers: {
              'token': `${token}`,
              'Content-Type': 'application/json'
          }
          });
          console.log(response_max.data?.total);
          setSelected_how_many_contacts(parseInt(response_max?.data?.total));
          setIsNumberOfContactsValid(true);
          setLoadingMax(false);
        }catch(error){
          console.log(error)
          setLoadingMax(false);
          alert('Por favor, tente novamente');
        }
      }
      if(!connection){
        setLoadingMax(false);
      }
    }
    getMax();
  },[loadingMax,connection,selected_how_many_contacts, isConnectionValid]);
  

  const wsRef = useRef(null);
  useEffect(() => {
    // localStorage.setItem('isDisparing',isDisparing)
    const token = localStorage.getItem('token');
    if(!wsRef.current){
      const ws = new WebSocket(`${WEBSOCKET_URL}?token=${token}`); // Connect to WebSocket server
      wsRef.current = ws;
    }
    wsRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN){
      if((isDisparing || localStorage.getItem('isDisparing')==='true') && paused && localStorage.getItem('paused')==='true'){// tem || devido ao cache isDisparing é um estado instantaneo e nao historico
        console.log('FRONTEND REQUISITOU PAUSE');
        wsRef.current.send('pause');
      }else if(isDisparing || localStorage.getItem('isDisparing')==='true'){
        wsRef.current.send('unpause')
      }
      if(stoped){
        console.log('FRONTEND REQUISITOU STOP');
        wsRef.current.send('stop');
      }
    }

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('O WEB SOCKET ENVIOU OS SEGUINTES DADOS');
      console.log(data);
      if(data.falhas){
        setFails(data.falhas);
      }
      console.log('Received data:', data);

      if(data.author==='disparo_for_loop'){
        setDisparoProgress(data.disparo_progress);
      }
    
      console.log('DISPARO PROGRESS')
      console.log(disparoProgress)
      if((data.author==="disparo_for_loop") && (parseInt((data?.disparo_progress)?.split('/')[0]) + parseInt((data.falhas)?(data.falhas):'0')) === parseInt((data?.disparo_progress)?.split('/')[1])){
        localStorage.setItem('last_disparo', new Date());//ÚTIL, MAS VAI SER CONSULTADO NO BACKEND
        console.log('CONCLUSAO DO DISPARO DETECTADA')
        setIsDisparing(false);
        setTotalDispared(parseInt((data?.disparo_progress)?.split('/')[0]));
        localStorage.setItem('isDisparing',false);
        setDisparoProgress('-/-');
        setFails(0);
        setSuccess(true);
        setPaused(false);
        localStorage.setItem('paused','false');
        setStoped(false);
      }else if((data.author==="disparo_for_loop") || (data.author==='pause') || (data.author==='unpause')){
        console.log('DATA PAUSED')
        console.log(data.paused)
        if(data.author==='pause'){//serve pra pausar o outro usuario
          setPaused(true);
          localStorage.setItem('paused','true');
        }else if(data.author==='unpause'){
          setPaused(false);
          localStorage.setItem('paused','false');
        }

        setIsDisparing(true);//serve pro outro usuario ver o disparo
        localStorage.setItem('isDisparing',true);//serve pro outro usuario ver o disparo

        console.log('PROGRESSO RECUPERARO')
        console.log(data?.disparo_progress)
      }else if((data.author==="stop")){//ambiguo mas medo de bugar
        localStorage.setItem('last_disparo', new Date());//ÚTIL, MAS VAI SER CONSULTADO NO BACKEND
        console.log('DADOS AO STOPAR');
        console.log(data);
        setIsDisparing(false);
        setTotalDispared(parseInt((data?.disparo_progress)?.split('/')[0]));
        localStorage.setItem('isDisparing',false);
        setDisparoProgress('-/-');
        setFails(0);
        setSuccess(true);
        setPaused(false);
        localStorage.setItem('paused','false');
        setStoped(false);
      }
    };

    // return () => {
    //   if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    //     console.log('Closing WebSocket connection...');
    //     wsRef.current.close();
    //   }
    // };
  }, [isDisparing, disparoProgress, fails, paused, stoped]);


  useEffect(()=>{
    console.log('use effect triggerado no pai')
    const get_connections = async()=>{
      try{
        const token = localStorage.getItem('token');
        const response_connections = await axios.get(`${BACKEND_URL}/connections`,{
          headers: {
            'token': `${token}`,
            'Content-Type': 'application/json'
        }
        })
  
        const user_connections = response_connections.data;
        if(user_connections){
          setHistoricConnections(user_connections)
        }else{
          setHistoricConnections(false)
        }
        console.log(user_connections);
      }catch(error){
        console.log(error)
      }
    }
    get_connections()
  },[]);

  useEffect(()=>{
    console.log('use effect triggerado no pai campanha')
    const get_campaigns = async()=>{
      try{
        const token = localStorage.getItem('token');
        const response_campaigns = await axios.get(`${BACKEND_URL}/campaigns`,{
          headers: {
            'token': `${token}`,
            'Content-Type': 'application/json'
        }
        })
  
        const user_campaigns = response_campaigns.data;
        if(user_campaigns){
          setHistoricCampaigns(user_campaigns)
        }else{
          setHistoricCampaigns(false)
        }
        console.log(user_campaigns);
      }catch(error){
        console.log(error)
      }
    }
    get_campaigns()
  },[]);

  //função pra trigar disparo no backend
  const Disparo = async () => {
    console.log('IMAGEM DA HORA DO DISPARO 64')
    console.log(image)
    if(typeDisparo==='e-commerce' && !finalWoocData){
      alert('Woocommerce não conectado!');
      return;
    }
    if(typeDisparo==='excel' && !excelFileName){
      alert('Arquivo excel não encontrado!');
      return;
    }
    if(localStorage.getItem('last_disparo')){
      if (new Date() - new Date(localStorage.getItem('last_disparo'))<=20000){
        alert('Aguarde alguns segundos para iniciar o proximo disparo');
        return;
      }
    }
    try {
        const token = localStorage.getItem('token');
        setIsDisparing(true);
        localStorage.setItem('isDisparing',true);
        await axios.post(`${BACKEND_URL}/disparo`, {
            disparo_type: typeDisparo,
            excel_contacts: finalExcelData,//se é undefined nao se preocupar o backend sabera procurar pelo typedisparo
            wooc_contacts: finalWoocData,
            campaign_name: campaign,
            connection_name: connection,
            unfilter_how_many_to_disparo: selected_how_many_contacts,
            campaigns_to_exclude: restrictedCampaigns,
            interval_lower_bound: lowerIntervalLimit,
            interval_upper_bound: upperIntervalLimit,
            number_to_trigger_pseudo_pause:numberToTriggerPseudoPause,
            pseudo_pause_lower_limit:pseudoPauseLowerLong,
            pseudo_pause_upper_limit:pseudoPauseUpperLong,
            message: MessageInParentComponent,
            image_base64: image,
            file_type:fileType,
        }, {
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        alert('Um erro ocorreu no disparo verifique os dados preenchidos e tente novamente!');
        setIsDisparing(false);
        localStorage.setItem('isDisparing',false);
        console.log(error);
    }
  };

    return(
            <div className={(isDisparing||(localStorage.getItem('isDisparing')==='true'))?'disparing':''}>
              <div className="generic_painel_label">Escolha um nome para esse disparo</div>
              <TextField size="small" onChange={(e)=>handleCampaignChange(e)} label="Nome da campanha" className="generic_painel_input"/>
              {isCampaignValid===false?(<div id="invalid_field">Nome da campanha inválido</div>):null}
              <div id="divider"></div>
              <div className="generic_painel_label">Selecione uma conexão:</div>
              <div className="any_flex">
                {historicConnections===null?<CircularProgress className="loading_con" color="secondary" />:null}
                <Select
                  className={"generic_painel_input " + (historicConnections===null?'loading_connection':'') }
                  value={connection}
                  onChange={handleConnectionChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {(historicConnections!==null)?(!historicConnections?(<MenuItem value="">
                    <em>Nenhuma conexão encontrada</em>
                  </MenuItem>):(
                      historicConnections.map((con,indexx)=>(
                        <MenuItem key={indexx} value={con}><em>{con}</em></MenuItem>
                      ))
                      // <MenuItem value={20}>Conexão 2</MenuItem>
                      // <MenuItem value={30}>Conexão 3</MenuItem>
                  )):(null)}
                </Select>
              </div>
              <div id="divider"></div>
              <div id="disparo_type">
                <div id="label_type_disparo">De onde veem os contatos?</div>
                  <div id="alert_type_disparo">Apenas a fonte selecionada será levada em conta</div>
                  <FormControl>
                    <RadioGroup
                      id="radio_disparo"

                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 18,
                        }}}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={typeDisparo}
                        onChange={handleTypeDisparo}
                      >
                        <FormControlLabel className="radio_label" value="lista" control={<Radio />} label={<div className="radio_label_inner">Lista de contatos</div>} />
                        <FormControlLabel className="radio_label" value="excel" control={<Radio />} label={<div className="radio_label_inner">Excel</div>} />
                        <FormControlLabel className="radio_label" value="e-commerce" control={<Radio />} label={<div className="radio_label_inner">E-Commerce (wordpress)</div>} />
                    </RadioGroup>
                  </FormControl>

                  {typeDisparo==='lista'?(<>
                    <div className="generic_painel_label">Escolha o total de contatos da lista de contatos a serem disparados:</div>
                      <div id="input_how_many" className={"input_how_many " + (loadingMax?'loading':'')}>
                        {loadingMax?<CircularProgress className="loading_max" color="secondary" />:null}
                        <div>
                              <TextField
                              onChange={(e)=>{handleHowManyContactChange(e)}}
                              size="small"
                              value={selected_how_many_contacts}
                              className="generic_painel_input how_many"
                              id="filled-number"
                              label="Total de contatos"
                              type="number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="filled"
                            />
                            {isNumberOfContactsValid===false?(<div id="invalid_field">Número inválido</div>):null}
                        </div>
                        <button id="max_contacts" onClick={handleLoadingMax}>Máx</button>
                      </div>
                    </>):typeDisparo==='excel'?(
                      <>
                      <div id="aux_flex2">

                          <label id="anexar_excel" htmlFor="import_excel"><RiFileExcel2Fill /><div>{excelFileName?excelFileName:"Importar contatos (.xlsx)"}</div></label>
                          <input type="file" id="import_excel" onChange={handleExcelFileChange} hidden/>

                          <div id="flex_aux4545">
                              <button id="preview_excel" onClick={openExcelPreview}><FaRegEye id="eye" /></button>
                              <button id="trash_excel" onClick={cleanExcel}><IoTrashBin id="trash"/></button>
                          </div>

                      </div>
                      </>
                    ):(
                      <>
                        <div id="aux_flex3">
                          <button id="config_wooc" onClick={openWoocDialog}><div id="flex-aux90"><SiWoocommerce id="wooc_icon" /><GrConfigure /></div></button>
                          <div id="flex_aux9999">
                                <button id="preview_wooc" onClick={openWoocPreview}><FaRegEye id="eye" /></button>
                                {/* <button id="trash_wooc" onClick={cleanWooc}><IoTrashBin id="trash"/></button> */}
                          </div>
                        </div>  
                      </>
                    )}
                <ExcelDialog setNomeColName={setNomeColName} setPhoneColName={setPhoneColName} phoneColName={phoneColName} nomeColName={nomeColName} handlePhoneColNameChange={handlePhoneColNameChange} handleNomeColNameChange={handleNomeColNameChange} JSexcelData={JSexcelData} isExcelDialogOpen={isExcelDialogOpen} openExcelDialog={openExcelDialog} closeExcelDialog={closeExcelDialog}/>
                <ExcelPreview finalExcelData={finalExcelData} isExcelPreviewOpen={isExcelPreviewOpen} openExcelPreview={openExcelPreview} closeExcelPreview={closeExcelPreview}/>
                <WoocDialog  id="wooc_dialog" openWoocPreview={openWoocPreview} setFinalWoocData={setFinalWoocData} isWoocDialogOpen={isWoocDialogOpen} openWoocDialog={openWoocDialog} closeWoocDialog={closeWoocDialog}  woocSite ={woocSite} setWoocSite={setWoocSite} woocConsumerKey={woocConsumerKey} setWoocConsumerKey={setWoocConsumerKey} woocConsumerSecret={woocConsumerSecret} setWoocConsumerSecret={setWoocConsumerSecret} woocStartDate={woocStartDate} setWoocStartDate={setWoocStartDate} woocEndDate={woocEndDate} setWoocEndDate={setWoocEndDate} woocOrderStatus={woocOrderStatus} setWoocOrderStatus={setWoocOrderStatus}/>
                <WoocPreview  id="wooc_preview" finalWoocData={finalWoocData} isWoocPreviewOpen={isWoocPreviewOpen} openWoocPreview={openWoocPreview} closeWoocPreview={closeWoocPreview}/>
                </div>
              <div id="divider"></div>
                <div className="generic_painel_label">Excluir desse disparo contatos que receberam disparo nas campanhas:</div>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  className="generic_painel_input"
                  value={restrictedCampaigns}
                  multiple
                  onChange={handleChange_on_restricted_campaign}
                  displayEmpty
                  renderValue={(selected) => selected.join(', ')}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {(!historicCampaigns)?(<MenuItem value="">
                    <em></em>
                  </MenuItem>):(
                      historicCampaigns.map((camp,indexx)=>(
                        <MenuItem key={camp} value={camp}>
                            <Checkbox checked={restrictedCampaigns.includes(camp)} />
                            <ListItemText primary={camp} />
                        </MenuItem>
                      ))
                      // <MenuItem value={20}>Conexão 2</MenuItem>
                      // <MenuItem value={30}>Conexão 3</MenuItem>
                  )}
                </Select>
                <div id="divider"></div>
                <IntervalDisparoDialog openIntervalDialog={openIntervalDialog} closeIntervalDialog={closeIntervalDialog} isIntervalDialogOpen={isIntervalDialogOpen} setIsIntervalDialogOpen={setIsIntervalDialogOpen} lowerIntervalLimit={lowerIntervalLimit} setLowerIntervalLimit={setLowerIntervalLimit}  upperIntervalLimit={upperIntervalLimit} setUpperIntervalLimit={setUpperIntervalLimit} pseudoPauseLowerLong={pseudoPauseLowerLong} setPseudoPauseLowerLong={setPseudoPauseLowerLong} pseudoPauseUpperLong={pseudoPauseUpperLong} setPseudoPauseUpperLong={setPseudoPauseUpperLong} numberToTriggerPseudoPause={numberToTriggerPseudoPause} setNumberToTriggerPseudoPause={setNumberToTriggerPseudoPause}/>
                <button id="set_temp" onClick={openIntervalDialog}><FaRegClock id="set_temp_icon"/><div>Intervalo entre mensagens (Pré configurado)</div></button>
                <button id="set_message" onClick={openConfigMessageDialog}><TbMessageCircleCog id="set_message_icon"/><div>Escrever mensagem</div></button>
                <SetMessageUI fileType={fileType} setFileType={setFileType} handleImageFile={handleImageFile} handleMessageValue={handleMessageValue} isConfigMessageDialogOpen={isConfigMessageDialogOpen} closeConfigMessageDialog={closeConfigMessageDialog}/>
                <button id="disparar_button" ref={refDisparo} onClick={Disparo}><IoIosSend id="aviao"/><div>Enviar</div></button>
            {(isDisparing||localStorage.getItem('isDisparing')==='true')?(<Dialog
                  open={acompanharDialogOpen}
                  onClose={closeAcompanharDialog}
                  PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      const formJson = Object.fromEntries(formData.entries());
                      const email = formJson.email;
                      console.log(email);
                    },
                  }}>
            <DialogTitle>{!(paused && localStorage.getItem('paused')==='true')?'Disparo em andamento':'Disparo pausado'}</DialogTitle>
            <DialogContent>
              <Box id="disparo_progress" sx={{ width: '100%' }}>
                      <div id="disparo_progress_label">Sucesso: {disparoProgress}</div>
                      <div id="falha">Falhas: {fails} </div>
                      <LinearProgress id="aiai" color="inherit" value={20}         sx={{
                      '& .MuiLinearProgress-bar': {
                          backgroundColor: 'rgba(0, 255, 0, 0.8)' // Green color with 50% opacity
                      },
                      '& .MuiLinearProgress-bar1Determinate': {
                          backgroundColor: 'green' // Floating progress color remains unchanged
                      }
                  }} />
              </Box>
            <button id="pausar" className={stoped?"pausar loading":""} onClick={goPause}>{(paused && localStorage.getItem('paused')==='true')?'Despausar':'Pausar'}</button>
            {!stoped?(<button id="kill_disparo" onClick={manageStop}>Parar disparo</button>):(<button id="kill_disparo" className="kill_disparo loading"><CircularProgress id="mini_circular_progress" color="inherit" /></button>)}
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>):null}

        {success?(<Dialog
                  open={successDialogOpen}
                  onClose={closeSuccessDialog}
                  PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      const formJson = Object.fromEntries(formData.entries());
                      const email = formJson.email;
                      console.log(email);
                    },
                  }}>
            <div id="success">
            <GoCheckCircleFill id="success_icon"/>
            <DialogTitle id="succes_label">{`Disparo ${UIStop?'cancelado':'concluído'} com sucesso!`}</DialogTitle>
            </div>
            <DialogContent>
              <div>O número de contatos disparados foi {totalDispared}</div>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>):null}
        <ToastContainer autoClose={1000} />
            </div>
    
    )
    }