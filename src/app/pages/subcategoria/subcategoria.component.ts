import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { SubcategoriaDTO } from 'src/models/subcategoriaDTO';
import { SubcategoriaService } from 'src/services/subcategoria/subcategoria.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


//interface usada para configurar a dialog de criação/edição de subcategorias
export interface DialogData {
  titulo: string;
}

@Component({
  selector: 'app-subcategoria',
  templateUrl: './subcategoria.component.html',
  styleUrls: ['./subcategoria.component.css']
})

export class SubcategoriaComponent implements OnInit {

  data!: DialogData;

  subcategorias: SubcategoriaDTO[] = [];

  formSubcategoria: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('')
  })

  formFiltroSubcategoria: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private subcategoriaService: SubcategoriaService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { }

  //****************************************************************************/           
  ngOnInit(): void {

    this.findAll();

  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const subcategoriaDTO: SubcategoriaDTO = {...this.formSubcategoria.value}
    
    if(subcategoriaDTO.id){ //edição
      
      this.subcategoriaService.update(subcategoriaDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Subcategoria alterada com sucesso!');
        this.subcategorias.push(response.body);
        this.formSubcategoria.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.subcategoriaService.insert(subcategoriaDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Subcategoria incluída com sucesso!');
        this.subcategorias.push(response.body);
        this.formSubcategoria.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 
    this.modalService.dismissAll();
    this.findAll();

  }

  //****************************************************************************/
  delete(subcategoriaDTO: SubcategoriaDTO){
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
          title: "Tem certeza?",
          mainMessage: "Você realmente deseja excluir a subcategoria ",
          detailMessage: subcategoriaDTO.nome,
          explanation: "Todo o histórico desta subcategoria será perdido",
          warning: "Esta operação não poderá ser desfeita!"
        }
    });
  

    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if(dialogResult){
            this.subcategoriaService.delete(subcategoriaDTO.id).subscribe(response => {

              this.messageService.setSucessMessage('Subcategoria excluída com sucesso!');
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
    this.subcategoriaService.findAll().subscribe(listaSubcategorias => this.subcategorias = listaSubcategorias);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroSubcategoria.get('nome')?.value;
    
    this.subcategoriaService.findByFilter(nome).subscribe(listaSubcategorias => this.subcategorias = listaSubcategorias);

  }

  //****************************************************************************/
  closeResult = '';
  openAddModal(content: any) {
    this.data = {titulo: 'Incluir Subcategoria'};
    this.modalService.open(content, {ariaLabelledBy: 'modalSubcategoria'});
  }

  //****************************************************************************/
  openEditModal(content: any, subcategoriaDTO: SubcategoriaDTO) {
    this.data = {titulo: 'Alterar Subcategoria'};

    this.formSubcategoria.setValue({id: subcategoriaDTO.id, nome: subcategoriaDTO.nome});
    this.modalService.open(content, {ariaLabelledBy: 'modalSubcategoria'});
  }


}
