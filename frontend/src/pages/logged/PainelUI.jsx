import { useState, useRef, useEffect} from 'react';
import './logged.css';
import FormControl from '@mui/material/FormControl';
import { DisparadorUI } from './DisparadorUI';
import {CampaignsUI} from './CampaignsUI';
import { ConexoesUI } from './ConexoesUI'; // Make sure ConexoesUI is properly imported
import { ImExit } from "react-icons/im";
import CircularProgress from '@mui/material/CircularProgress';
import { MagicMotion } from 'react-magic-motion';

export const PainelUI = ({disparoState, setDisparoState}) => {
  const [focusedButton, setFocusedButton] = useState('disparador');
  const [CampaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const painelRef = useRef();

  const focusUI = (e, name) => {
    e.preventDefault();
    setFocusedButton(name);

  };

  const KillToken = (e)=>{
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.reload();

  }

 
  // Function to update dimensions of DisparadorUI

  return (
    <div id="painel">
      <form action="#" id="painel_form" ref={painelRef} onSubmit={(e)=>{e.preventDefault()}}>
        <FormControl  sx={{ m: 1, minWidth: 120 }} size="small">
          <div id="nav_container">
            <button
              href="#"
              onClick={(e) => focusUI(e, 'disparador')}
              className={'nav_item' + (focusedButton === 'disparador' ? ' focused' : '')}
            >
              Disparador
            </button>
            <button
              href="#"
              onClick={(e) => setCampaignDialogOpen(true)}
              className={'nav_item' + (focusedButton === 'campanhas' ? ' focused' : '')}
            >
              Campanhas
            </button>
            <button
              href="#"
              onClick={(e) => focusUI(e, 'conexoes')}
              className={'nav_item' + (focusedButton === 'conexoes' ? ' focused' : '')}
            >
              Conexões
            </button>
            {focusedButton === 'disparador'?<button id="logout" onClick={(e)=>KillToken(e)}>Sair <ImExit/></button>:''}
          </div>
          {focusedButton === 'disparador' ? (
            <DisparadorUI disparoState={disparoState} setDisparoState={setDisparoState} />
          ) : <ConexoesUI/>}
        </FormControl>
      </form>
      <CampaignsUI CampaignDialogOpen={CampaignDialogOpen} setCampaignDialogOpen={setCampaignDialogOpen}/>
    </div>
  );
};
