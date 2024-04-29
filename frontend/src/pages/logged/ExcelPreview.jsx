import {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const ExcelPreview = ({finalExcelData,isExcelPreviewOpen, openExcelPreview,closeExcelPreview}) => {
  console.log('excel final apos a renderização')
  console.log(finalExcelData)
  return (
  <Dialog
        open={isExcelPreviewOpen}
        onClose={closeExcelPreview}
        maxWidth={false}
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
    <DialogTitle>Preview Excel</DialogTitle>
    {finalExcelData?<div id="duplicate_alert">Não se preocupe, os telefones duplicados serão ignorados na hora do disparo.</div>:null}
        <DialogActions>
        {/* <div id="table_container"> */}
        {finalExcelData?(
        <>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Nome do contato</TableCell>
                    <TableCell align="left">Telefone (não precisa formatar)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {finalExcelData?.map((row) => (
                    <TableRow key={row.nome}sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">{row.nome}</TableCell>
                        <TableCell id="telefone" align="left">{row.phone}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer></>):(<div id="none_import">Nenhum arquivo importado até o momento</div>)}
            {/* </div> */}
            </DialogActions>
    </Dialog>
  )
}


