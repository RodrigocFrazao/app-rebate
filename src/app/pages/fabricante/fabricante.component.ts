import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { FabricanteDTO } from 'src/models/fabricanteDTO';
import { FabricanteService } from 'src/services/fabricante/fabricante.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


//interface usada para configurar a dialog de criação/edição de fabricantes
export interface DialogData {
  titulo: string;
}

@Component({
  selector: 'app-fabricante',
  templateUrl: './fabricante.component.html',
  styleUrls: ['./fabricante.component.css']
})



export class FabricanteComponent implements OnInit {

  data!: DialogData;
  fabricantes: FabricanteDTO[] = [];

  formFabricante: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('')
  })

  formFiltroFabricante: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private fabricanteService: FabricanteService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { }

  //****************************************************************************/           
  ngOnInit(): void {

    this.findAll();

  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const fabricanteDTO: FabricanteDTO = {...this.formFabricante.value}
    
    if(fabricanteDTO.id){ //edição
      
      this.fabricanteService.update(fabricanteDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Fabricante alterado com sucesso!');
        this.fabricantes.push(response.body);
        this.formFabricante.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.fabricanteService.insert(fabricanteDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Fabricante incluído com sucesso!');
        this.fabricantes.push(response.body);
        this.formFabricante.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 
    this.modalService.dismissAll();
    this.findAll();

  }

  //****************************************************************************/
  delete(fabricanteDTO: FabricanteDTO){
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
          title: "Tem certeza?",
          mainMessage: "Você realmente deseja excluir o fabricante ",
          detailMessage: fabricanteDTO.nome,
          explanation: "Todo o histórico deste fabricante será perdido",
          warning: "Esta operação não poderá ser desfeita!"
        }
    });
  

    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if(dialogResult){
            this.fabricanteService.delete(fabricanteDTO.id).subscribe(response => {

              this.messageService.setSucessMessage('Fabricante excluído com sucesso!');
              this.findAll();
            },
            error => {
              this.messageService.setErrorMesage(error);
            });
      }
      
    });
      
  }

  //****************************************************************************/
  findAll(){
    this.fabricanteService.findAll().subscribe(listaFabricantes => this.fabricantes = listaFabricantes);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroFabricante.get('nome')?.value;
    
    this.fabricanteService.findByFilter(nome).subscribe(listaFabricantes => this.fabricantes = listaFabricantes);
  }

  //****************************************************************************/
  closeResult = '';
  openAddModal(content: any) {
    this.data = {titulo: 'Incluir Fabricante'};
    this.modalService.open(content, {ariaLabelledBy: 'modalFabricante'});
  }

  //****************************************************************************/
  openEditModal(content: any, fabricanteDTO: FabricanteDTO) {
    this.data = {titulo: 'Alterar Fabricante'};

    this.formFabricante.setValue({id: fabricanteDTO.id, nome: fabricanteDTO.nome});
    this.modalService.open(content, {ariaLabelledBy: 'modalFabricante'});
  }


}
