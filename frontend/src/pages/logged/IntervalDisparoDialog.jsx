import {useState,useEffect, useRef} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { TextField } from '@mui/material';

import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
export const IntervalDisparoDialog = ({openIntervalDialog,closeIntervalDialog,isIntervalDialogOpen, setIsIntervalDialogOpen,lowerIntervalLimit,setLowerIntervalLimit,upperIntervalLimit, setUpperIntervalLimit,pseudoPauseLowerLong, setPseudoPauseLowerLong,pseudoPauseUpperLong, setPseudoPauseUpperLong,numberToTriggerPseudoPause, setNumberToTriggerPseudoPause}) => {
  useEffect(()=>{
    console.log('   mudou')

  },[isIntervalDialogOpen]);

  const handleLowerIntervalLimitChange = (e)=>{
    if(!parseInt(e?.target?.value)){
        alert('Não pode ser vazio')
    }
    else if(parseInt(e?.target?.value)<5){
        alert('O valor mínimo é 5 segundos')
    }else if(parseInt(e?.target?.value)>=parseInt(upperIntervalLimit)){
        alert('O limite inferior não pode ser maior que o superior')
    }
    else{
        setLowerIntervalLimit(e?.target?.value)
    }
  }

  const handleUpperIntervalLimitChange = (e) =>{
    if(!parseInt(e?.target?.value)){
        alert('Não pode ser vazio')
    }
    else if(parseInt(e?.target?.value)>120){
        alert('O valor máximo é 120 segundos')
    }else if(parseInt(e?.target?.value)<=parseInt(lowerIntervalLimit)){
        console.log('UPPER LIMITE')
        console.log(e?.target?.value)
        console.log('LOWER LIMIT')
        console.log(lowerIntervalLimit)
        alert('O limite superior não pode ser menor que o inferior')
    }
    else{
        setUpperIntervalLimit(e?.target?.value)
    }
  }

  const handleNumberToTriggerPseudoPause = (e) =>{
    console.log('VALOR BUGADOO')
    console.log(e?.target?.value)
    if(!parseInt(e?.target?.value)){
        alert('Não pode ser vazio')
    }
    else if(parseInt(e?.target?.value)<20){
        alert('Não pode ser menor que 20')
    }else{
        setNumberToTriggerPseudoPause(e?.target?.value);
    }
  }

  const handlePseudoPauseLowerLong = (e)=>{
    if(!parseInt(e?.target?.value)){
        alert('Não pode ser vazio')
    }
    else if(parseInt(e?.target?.value)<20){
        alert('Não pode ser menor que 20')
    }else if(parseInt(e?.target?.value)>=parseInt(pseudoPauseUpperLong)){
        alert('O limite superior não pode ser menor igual que o inferior')
    }else{
        setPseudoPauseLowerLong(e?.target?.value);
    }
  }

  const handlePseudoPauseUpperLong = (e)=>{
    if(!parseInt(e?.target?.value)){
        alert('Não pode ser vazio')
    }
    else if(parseInt(e?.target?.value)<20){
        alert('Não pode ser menor que 20')
    }else if(parseInt(e?.target?.value)<=parseInt(pseudoPauseLowerLong)){
        alert('O limite inferior não pode ser maior igual que o superior')
    }else{
        setPseudoPauseUpperLong(e?.target?.value);
    }
  }

  return (
    <FormControl>
    <Dialog
    open={isIntervalDialogOpen}
    onClose={closeIntervalDialog}>
        <DialogTitle>Configurar intervalo entre mensagens</DialogTitle>
        <div id="not_alter">Não recomendamos alterar as configurações padrão</div>
        <DialogContent>
            <div className="bounds-label first">**Intervalo entre cada mensagem:</div>
            <div className="bounds-container">
                <div>Aleatório entre</div>
                <TextField className="bound" onChange={(e)=>{handleLowerIntervalLimitChange(e)}} size="small" value={lowerIntervalLimit} id="filled-number" label="Menor" type="number" InputLabelProps={{shrink: true,}} variant="filled"/>
                <div>e</div>
                <TextField className="bound" onChange={(e)=>{handleUpperIntervalLimitChange(e)}} size="small" value={upperIntervalLimit} id="filled-number" label="Maior" type="number" InputLabelProps={{shrink: true,}} variant="filled"/>
            </div>

            <div className="bounds-label second">**Intervalo a cada X contatos disparados:</div>
            <div className="bounds-container">
                <div>A cada</div>
                <TextField className="bound" onChange={(e)=>{handleNumberToTriggerPseudoPause(e)}} size="small" value={numberToTriggerPseudoPause} id="filled-number" label="num" type="number" InputLabelProps={{shrink: true,}} variant="filled"/>
                <div>contatos</div>
                <div>esperar</div>
                <div>aleatório entre</div>
                <TextField className="bound" onChange={(e)=>{handlePseudoPauseLowerLong(e)}} size="small" value={pseudoPauseLowerLong} id="filled-number" label="Menor" type="number" InputLabelProps={{shrink: true,}} variant="filled"/>
                <div>e</div>
                <TextField className="bound" onChange={(e)=>{handlePseudoPauseUpperLong(e)}} size="small" value={pseudoPauseUpperLong} id="filled-number" label="Maior" type="number" InputLabelProps={{shrink: true,}} variant="filled"/>
            </div>
            <button className="ready" onClick={closeIntervalDialog}>Pronto</button>
        </DialogContent>
    </Dialog>
    </FormControl>
  )
}
