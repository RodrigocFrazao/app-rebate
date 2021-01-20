import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { CategoriaDTO } from 'src/models/categoriaDTO';
import { CategoriaService } from 'src/services/categoria/categoria.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


//interface usada para configurar a dialog de criação/edição de categorias
export interface DialogData {
  titulo: string;
}

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})

export class CategoriaComponent implements OnInit {

  data!: DialogData;

  categorias: CategoriaDTO[] = [];

  formCategoria: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('', [Validators.required, Validators.maxLength(50)])
  })

  formFiltroCategoria: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private categoriaService: CategoriaService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { }

  //****************************************************************************/           
  ngOnInit(): void {

    this.findAll();

  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const categoriaDTO: CategoriaDTO = {...this.formCategoria.value}
    
    if(categoriaDTO.id){ //edição
      
      this.categoriaService.update(categoriaDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Categoria alterada com sucesso!');
        this.formCategoria.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.categoriaService.insert(categoriaDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Categoria incluída com sucesso!');
        this.formCategoria.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 
    this.modalService.dismissAll();
    this.findByFilter();

  }

  //****************************************************************************/
  delete(categoriaDTO: CategoriaDTO){
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
          title: "Tem certeza?",
          mainMessage: "Você realmente deseja excluir a categoria ",
          detailMessage: categoriaDTO.nome,
          explanation: "Todo o histórico desta categoria será perdido",
          warning: "Esta operação não poderá ser desfeita!"
        }
    });
  

    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if(dialogResult){
            this.categoriaService.delete(categoriaDTO.id).subscribe(response => {

              this.messageService.setSucessMessage('Categoria excluída com sucesso!');
              this.findByFilter();
            },
            error => {
              this.messageService.setErrorMesage(error);
            });
      }
      
    });
      
  }

  //****************************************************************************/
  findAll(){
    this.categoriaService.findAll().subscribe(listaCategorias => this.categorias = listaCategorias);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroCategoria.get('nome')?.value;
    
    this.categoriaService.findByFilter(nome).subscribe(listaCategorias => this.categorias = listaCategorias);
  }

  //****************************************************************************/
  
  openAddModal(content: any) {
    this.data = {titulo: 'Incluir Categoria'};
    this.modalService.open(content, {ariaLabelledBy: 'modalCategoria'});
  }

  //****************************************************************************/
  openEditModal(content: any, categoriaDTO: CategoriaDTO) {
    this.data = {titulo: 'Alterar Categoria'};

    this.formCategoria.setValue({id: categoriaDTO.id, nome: categoriaDTO.nome});
    this.modalService.open(content, {ariaLabelledBy: 'modalCategoria'});
  }


}
