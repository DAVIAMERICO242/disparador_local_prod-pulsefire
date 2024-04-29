import { TextField } from '@mui/material';
import './login.css'
import axios from 'axios'
import skylerImage from './skyler.png'; // Import the image
import {useRef,useState, useEffect} from 'react'
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
const BACKEND_URL = (import.meta.env.VITE_PROD_ENV==='TRUE')?(`https://${import.meta.env.VITE_BACKEND_PROXY}`):(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}`);
export const Logout = () => {
    const navigateTo = useNavigate();
    useEffect(() => {
      // Limpar localStorage
      async function resetUserCache(){
        try{
          const token = localStorage.getItem('token');
          await axios.get(`${BACKEND_URL}/reset_user_cache`,{//hehe
            headers: {
              'token': `${token}`,
              'Content-Type': 'application/json'
          }
          });
          localStorage.clear('token');
          localStorage.clear('user');
          localStorage.clear('paused');
          localStorage.clear('isDisparing');
          localStorage.clear('last_disparo');
          navigateTo('/login');
        }catch{
          console.log('Erro ao resetar cache');
          navigateTo('/login');
        }
      }
      resetUserCache();
      // Redirecionar para a rota de painel após o logout
    }, []);
  
    return null; // Este componente não renderiza nada
  };
  