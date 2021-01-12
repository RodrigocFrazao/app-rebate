import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { ModeloDTO } from 'src/models/modeloDTO';
import { ModeloService } from 'src/services/modelo/modelo.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


//interface usada para configurar a dialog de criação/edição de modelos
export interface DialogData {
  titulo: string;
}

@Component({
  selector: 'app-modelo',
  templateUrl: './modelo.component.html',
  styleUrls: ['./modelo.component.css']
})



export class ModeloComponent implements OnInit {

  data!: DialogData;
  modelos: ModeloDTO[] = [];

  formModelo: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('')
  })

  formFiltroModelo: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private modeloService: ModeloService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { }

  //****************************************************************************/           
  ngOnInit(): void {

    this.findAll();

  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const modeloDTO: ModeloDTO = {...this.formModelo.value}
    
    if(modeloDTO.id){ //edição
      
      this.modeloService.update(modeloDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Modelo alterado com sucesso!');
        this.modelos.push(response.body);
        this.formModelo.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.modeloService.insert(modeloDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Modelo incluído com sucesso!');
        this.modelos.push(response.body);
        this.formModelo.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 
    this.modalService.dismissAll();
    this.findAll();

  }

  //****************************************************************************/
  delete(modeloDTO: ModeloDTO){
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
          title: "Tem certeza?",
          mainMessage: "Você realmente deseja excluir o modelo ",
          detailMessage: modeloDTO.nome,
          explanation: "Todo o histórico deste modelo será perdido",
          warning: "Esta operação não poderá ser desfeita!"
        }
    });
  

    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if(dialogResult){
            this.modeloService.delete(modeloDTO.id).subscribe(response => {

              this.messageService.setSucessMessage('Modelo excluído com sucesso!');
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
    this.modeloService.findAll().subscribe(listaModelos => this.modelos = listaModelos);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroModelo.get('nome')?.value;
    
    this.modeloService.findByFilter(nome).subscribe(listaModelos => this.modelos = listaModelos);
  }

  //****************************************************************************/
  closeResult = '';
  openAddModal(content: any) {
    this.data = {titulo: 'Incluir Modelo'};
    this.modalService.open(content, {ariaLabelledBy: 'modalModelo'});
  }

  //****************************************************************************/
  openEditModal(content: any, modeloDTO: ModeloDTO) {
    this.data = {titulo: 'Alterar Modelo'};

    this.formModelo.setValue({id: modeloDTO.id, nome: modeloDTO.nome});
    this.modalService.open(content, {ariaLabelledBy: 'modalModelo'});
  }


}
