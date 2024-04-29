import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import Select from '@mui/material/Select';
import {useState, useEffect} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';




export const ExcelDialog = ({handleNomeColNameChange,handlePhoneColNameChange,nomeColName, setNomeColName, setPhoneColName, phoneColName,JSexcelData,isExcelDialogOpen,openExcelDialog,closeExcelDialog}) => {


  const [excelColumns,setExcelColumns] = useState(null);



  useEffect(() => {
    setNomeColName(null);
    setPhoneColName(null);
    // Set excelColumns state after JSexcelData is available
    if (JSexcelData) {
      console.log('DATA INSIDE');
      console.log(Object.keys(JSexcelData[0]));
      setExcelColumns(Object.keys(JSexcelData[0]));
    }
  }, [JSexcelData]); // Run this effect whenever JSexcelData changes


  return (
    <FormControl>
    <Dialog
    open={isExcelDialogOpen}
    onClose={closeExcelDialog}
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
        <DialogTitle>Configurar importação excel (.xlsx)</DialogTitle>
        <DialogContent>
            <div className="flex_aux6">
                <div className="select_column_label">Coluna nome:</div>
                <Select
                className="select_column"
                value={nomeColName}
                onChange={handleNomeColNameChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                >
                {(excelColumns!==null)?(!excelColumns?(<MenuItem value="">
                    <em>Nenhuma coluna encontrada</em>
                </MenuItem>):(
                    excelColumns.map((col,indexx)=>(
                        <MenuItem key={indexx} value={col}><em>{col}</em></MenuItem>
                    ))
                    // <MenuItem value={20}>Conexão 2</MenuItem>
                    // <MenuItem value={30}>Conexão 3</MenuItem>
                )):(null)}
                </Select>
            </div>

            <div className="flex_aux6">
                <div className="select_column_label">Coluna número:</div>
                <Select
                className="select_column"
                value={phoneColName}
                onChange={handlePhoneColNameChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                >
                {(excelColumns!==null)?(!excelColumns?(<MenuItem value="">
                    <em>Nenhuma coluna encontrada</em>
                </MenuItem>):(
                    excelColumns.map((col,indexx)=>(
                        <MenuItem key={indexx} value={col}><em>{col}</em></MenuItem>
                    ))
                    // <MenuItem value={20}>Conexão 2</MenuItem>
                    // <MenuItem value={30}>Conexão 3</MenuItem>
                )):(null)}
                </Select>
            </div>
            <button onClick={()=>closeExcelDialog('cancelled')} id="cancel_columns">Cancelar</button>
            <button onClick={closeExcelDialog} id="ready_columns">Pronto</button>
        </DialogContent>
    </Dialog>
    </FormControl>
  )
}


