import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
const BACKEND_URL = (import.meta.env.VITE_PROD_ENV==='TRUE')?(`https://${import.meta.env.VITE_BACKEND_PROXY}`):(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}`)


export const RedirectAuthBased = () => {
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
        }
        catch{
            navigateTo('/login')
        }
    }
    check_private_route();
  },[])

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
  
}

