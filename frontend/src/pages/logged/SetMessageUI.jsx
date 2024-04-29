import EmojiPicker from 'emoji-picker-react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { FaImage } from "react-icons/fa6";
import { RiErrorWarningLine } from "react-icons/ri";
import Tooltip from '@mui/material/Tooltip';
import {useState, useEffect, useRef} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { GrEmoji } from "react-icons/gr";



//as props antes de isConfig são para comunicar o componente pai o estado desse componente (<SetMessageUI/>)
export const SetMessageUI = ({fileType,setFileType,handleImageFile,handleMessageValue, isConfigMessageDialogOpen, closeConfigMessageDialog}) => {
  //ref da mensagem
  const [cursorStartIndex, setCursorStartIndex] = useState(0);
  const [isEmojiClick, setIsEmojiClick] = useState(false);

  const identifyCursorPosition = (e) => {
    console.log('POSIÇÃO DO CURSOR')
    console.log(e.target.selectionStart)
    setCursorStartIndex(parseInt(e?.target?.selectionStart))
  };



  //use state das mensagens
  const [currentMessage,setCurrentMessage] = useState('');
  const handleCurrentMessage = (event)=>{
    setCurrentMessage(event.target.value)
    console.log('mensagem no filho')
    console.log(currentMessage)
  }

  //logica do upload de arquivos

  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName,setFileName] = useState(null);

  const handleImageChange = (event) => {
        const file = event.target.files[0];
        const file_name = file?.name;
        const file_size = file?.size;
        const allowedExtensions = /(\.png|\.webp|\.jpg|\.jpeg|\.mp4)$/i; 
        if (!allowedExtensions.test(file.name)) {
          alert('Extensões aceitas: mp4,png,webp,jpg,jpeg');
        }else if(file_size>10 * 1024 * 1024){
          alert('O tamanho máximo de arquivo é 10mb');
        }
        else{
            if((file_name).includes('.mp4')){
              setFileType('video');
            }else if((file_name).includes('.png') || (file_name).includes('.webp') || (file_name).includes('.jpg') || (file_name).includes('.jpeg') ){
              setFileType('image');
            }else{
              setFileType('document');
            }
            setFileName(file_name);
            setSelectedImage(file);
            handleImageFile(file);
        }
        
        };

  //manuseando toggle do emoji:
  const [isToggledEmoji,setIsToggledEmoji] = useState(false)
  const [isEmojiLoading, setIsEmojiLoading] = useState(false)

  const handleToggleEmoji = ()=>{
    setIsToggledEmoji((prev)=>(!prev))
    setIsEmojiLoading(true)
  }

  const onEmojiClick = (emojiObject,event)=>{
    var new_value = currentMessage?(currentMessage + emojiObject.emoji):emojiObject.emoji
    console.log('novo valor')
    console.log(new_value)
    console.log('CURSOR INDEX DENTRO DE EMOJI')
    console.log(cursorStartIndex)
    var message_after_emoji_click = currentMessage.slice(0,cursorStartIndex) + currentMessage?(currentMessage + emojiObject.emoji):emojiObject.emoji + currentMessage.slice(cursorStartIndex)
    setCurrentMessage((prev)=>(prev?(prev + emojiObject.emoji):emojiObject.emoji))
  }

  const onNameClick = (e)=>{
    e?.preventDefault();
    var message_after_name_click = currentMessage.slice(0,cursorStartIndex) + '{nome_do_cliente}' + currentMessage.slice(cursorStartIndex)
    console.log('INDEX AFTER NAME CLICK')
    console.log(cursorStartIndex)
    console.log('Message after name click')
    console.log(message_after_name_click)
    setCurrentMessage(message_after_name_click)
    // setCurrentMessage((prev)=>(prev + '{nome_do_cliente}'))
  }
  
  useEffect(() => {
    console.log('render')
    setIsEmojiLoading(false)
    // This will run after the component is mounted/rendered
  }, [isToggledEmoji]); // Empty dep

  useEffect(()=>{
    handleMessageValue(currentMessage);
  }, [currentMessage])

  return (
        <Dialog
        className="message_dialog"
        open={isConfigMessageDialogOpen}
        onClose={closeConfigMessageDialog}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            closeConfigMessageDialog();
          },
        }}>
            <DialogTitle>Configurar mensagem</DialogTitle>
            <DialogContent>
            <DialogContentText id="message_alert_title">
                Insira uma mensagem para o disparo
            </DialogContentText>
            <div id="message-flex">
                <div id="toggle_emoji" onClick={handleToggleEmoji}>
                    <GrEmoji />
                </div>
                <button id="set_target_name" onClick={onNameClick}>{"{nome_do_cliente}"}</button>
                {isEmojiLoading?<CircularProgress />:''}
            </div>
              <EmojiPicker className="emoji_picker" height={350} open={isToggledEmoji} onEmojiClick={onEmojiClick}/>
            <TextField
                    onMouseUp={identifyCursorPosition}
                    onKeyDown={identifyCursorPosition}
                    onKeyUp={identifyCursorPosition}
                    focused
                    value={currentMessage}
                    onChange={handleCurrentMessage}
                    className="message_box"
                    id="outlined-multiline-static"
                    label="Mensagem"
                    multiline
                    rows={11}
                    defaultValue=""
            />
            </DialogContent>
            <DialogActions>
            {/* <div id="open_emojis_button">Emojis <img id="emoji_image" src="/emoji-icon.png" alt="Emoji" /></div> */}

            <div id="on-left">
                <label id="anexar_arquivo" htmlFor="upload"><FaImage /><div>{fileName?fileName:"Anexar"}</div></label>
                <input type="file" id="upload" onChange={handleImageChange} hidden/>
                <Tooltip title="A mensagem será colada com a imagem por padrão" placement="right-start">
                    <div>
                        <RiErrorWarningLine/>
                    </div>
                </Tooltip>
            </div>
            <button id="ready_message" onClick={closeConfigMessageDialog} type="submit">Pronto!</button>
            </DialogActions>
            
        </Dialog>
  )
}


