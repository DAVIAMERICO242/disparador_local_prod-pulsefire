import { toast, ToastContainer } from 'react-toastify';
import {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './logged.css'
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios'
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';


const BACKEND_URL = (import.meta.env.VITE_PROD_ENV==='TRUE')?(`https://${import.meta.env.VITE_BACKEND_PROXY}`):(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}`);

export function CampaignsUI({CampaignDialogOpen,setCampaignDialogOpen}) {

  const [selectedCampaigns, setSelectedCampaigns]= useState([]);
  const [historicCampaigns, setHistoricCampaigns]= useState(null);
  const [deleteLoading, setDeleteLoading]= useState(false);
  const [exportLoading, setExportLoading]= useState(false);
  const [wasDeleteSuccess, setWasDeleteSuccess] = useState(false);

  const openCampaignDialog = (e)=>{
    e?.preventDefault()
    setCampaignDialogOpen(true)
  }

  const closeCampaignDialog = (e)=>{
    e?.preventDefault()
    if(!deleteLoading){
      setCampaignDialogOpen(false)
    }
  }

  const handleChange_on_campaign = (event) => {
    console.log('DETECTANDO CONEXAO')
    console.log(event.target.value)
    setSelectedCampaigns(event.target.value);
  };

  useEffect(()=>{


    console.log('use effect triggerado no pai AQUIE')
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
  },[CampaignDialogOpen]);

  const DeleteCampaign = async()=>{
    const confirm = window.confirm('Tem certeza que deseja deletar essa campanha?');
    if(!confirm){
      return;
    }
    try{
      setWasDeleteSuccess(false)
      setDeleteLoading(true)
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/delete_campaigns`, {
        campaigns: selectedCampaigns
      }, {
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json'
            }
        });
      setDeleteLoading(false)
      setWasDeleteSuccess(true)
      setHistoricCampaigns(prev => prev.filter(e => !selectedCampaigns.includes(e)));
      setSelectedCampaigns([]);
    }catch{
      setWasDeleteSuccess(false)
      setDeleteLoading(false)
      alert('Erro ao deletar campanha')
    }
  }

  const ExportCampaign =async()=>{
    setExportLoading(true);
    try{
      const token = localStorage.getItem('token');
      const campaigns_data = await axios.get(`${BACKEND_URL}/whole_campaigns`,{
        params:{
          campaigns: selectedCampaigns
        },
        headers: {
          'token': `${token}`,
          'Content-Type': 'application/json'
      }
      });
      setExportLoading(false);
      const campaignsData = campaigns_data.data;
      console.log(campaigns_data.data);
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(campaignsData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaign Data');

      // Generate a Blob object containing the workbook
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Save the Blob object as a file using FileSaver.js
      saveAs(blob, 'campaign_data.xlsx');
    }catch{
      alert('Erro na exportação')
    }
  }


  return (
    <>
    <Dialog open={CampaignDialogOpen} onClose={closeCampaignDialog}>
        <DialogTitle>Gestão de campanhas</DialogTitle>
        <DialogContent>
        {historicCampaigns===null?
        <>
        <div className="flex">
          <CircularProgress className="loading_camp" color="secondary" />
          <div>carregando campanhas...</div>
        </div>
        </>:null}
        
        <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            className="generic_painel_input"
            value={selectedCampaigns}
            multiple
            onChange={handleChange_on_campaign}
            displayEmpty
            renderValue={(selected) => selected.join(', ')}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {(!historicCampaigns)?(<MenuItem value="">
              <em></em>
            </MenuItem>):(
                historicCampaigns.map((camp,indexx)=>(
                  <MenuItem key={camp} value={camp}>
                      <Checkbox checked={selectedCampaigns.includes(camp)} />
                      <ListItemText primary={camp} />
                  </MenuItem>
                ))
                // <MenuItem value={20}>Conexão 2</MenuItem>
                // <MenuItem value={30}>Conexão 3</MenuItem>
            )}
        </Select>
        {wasDeleteSuccess?<div className="success_delete_campaign">operação realizada com sucesso</div>:null}
        <DialogActions>
        <div className="flex_buttons">
          <button id="cancel_camp" onClick={closeCampaignDialog}>Cancelar</button>
          <button onClick={DeleteCampaign} className={"go_delete_campaign " + ((selectedCampaigns && !deleteLoading && !exportLoading)?'':"blocked")} type="submit">
            <div className={deleteLoading?"opacity0":null}>Deletar</div>
            {deleteLoading?<CircularProgress  color="inherit" id="deleting_camp"/>:null}
          </button>
          <button onClick={ExportCampaign} className={"export_camp " + ((selectedCampaigns && !deleteLoading && !exportLoading)?'':"blocked")}>
            <div className={exportLoading?"opacity0":null}>Exportar</div>
            {exportLoading?<CircularProgress  color="inherit" id="exporting_camp"/>:null}
          </button>
        </div>
        </DialogActions>
        </DialogContent>
    </Dialog>
    </>
  )
}

