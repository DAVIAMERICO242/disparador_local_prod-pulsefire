import axios from 'axios'
import {useEffect,useState } from 'react';
import { useNavigate} from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import {PainelUI} from './PainelUI'
const BACKEND_URL = (import.meta.env.VITE_PROD_ENV==='TRUE')?(`https://${import.meta.env.VITE_BACKEND_PROXY}`):(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}`);



export const Painel = () => {
  const [isAuth,setIsAuth] = useState(null);
  const [disparoState, setDisparoState] = useState(null);
  const navigateTo = useNavigate();
  useEffect(()=>{
    const check_private_route = async()=>{
        try{
            const token = localStorage.getItem('token');
            await axios.get(`${BACKEND_URL}/private_route`, {withCredentials: true, headers:{
                'token': `${token}`,
                'Content-Type': 'application/json'
            } });
            setTimeout(() => {
                navigateTo('/painel')
            }, 2000);
            setIsAuth(true)
        }
        catch{
            navigateTo('/login')
            setIsAuth(false)
        }
    }
    check_private_route();
  },[]);

  useEffect(()=>{
    const check_disparing = async()=>{
      try{
        const token = localStorage.getItem('token');
        const is_disparing = await axios.get(`${BACKEND_URL}/is_disparing`, {withCredentials: true, headers:{
            'token': `${token}`,
            'Content-Type': 'application/json'
        } });
        console.log('SAIDA DE is_disparing');
        console.log(is_disparing.data);
        setDisparoState(is_disparing?.data?.is_user_disparing);

      }catch{
        setDisparoState(false);
      }
    }
    check_disparing();
  },[]);


  return (
    <>
      {isAuth===null||disparoState===null? (
      <>
      <Stack sx={{ width: '100%'}} spacing={2}>
            <LinearProgress id="painel_top_progress"/>
      </Stack>
      </>
      ):(isAuth?(
            <PainelUI disparoState={disparoState} setDisparoState={setDisparoState}/>
      ):(<div>Forbidden</div>))}
    </>
    )
}


