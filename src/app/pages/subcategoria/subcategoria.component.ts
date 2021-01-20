import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { SubcategoriaDTO } from 'src/models/subcategoriaDTO';
import { SubcategoriaService } from 'src/services/subcategoria/subcategoria.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaDTO } from 'src/models/categoriaDTO';
import { CategoriaService } from 'src/services/categoria/categoria.service';


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

  categorias: CategoriaDTO[] = [];
  subcategorias: SubcategoriaDTO[] = [];

  formSubcategoria: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    idCategoria: new FormControl('', Validators.required)
  })

  formFiltroSubcategoria: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private subcategoriaService: SubcategoriaService
             , private categoriaService: CategoriaService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { }

  //****************************************************************************/           
  ngOnInit(): void {
    //alimentar o array de categorias para preencher a combo
    this.categoriaService.findAll().subscribe(listaCategorias => this.categorias = listaCategorias);
    this.findAll();
    
  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const subcategoriaDTO: SubcategoriaDTO = {...this.formSubcategoria.value}
    
    /*
    seta a categoria da subcategoria
    o nome da categoria não é importante, pois para criar a relação basta o id da categoria
    */
    subcategoriaDTO.categoria = {
      id: this.formSubcategoria.get('idCategoria')?.value, 
      nome: ''
    };
    
    //se ja tem id é uma alteração
    if(subcategoriaDTO.id){
      
      this.subcategoriaService.update(subcategoriaDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Subcategoria alterada com sucesso!');
        
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //se não tem id é uma inclusão
      
      this.subcategoriaService.insert(subcategoriaDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Subcategoria incluída com sucesso!');
        
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 
    
    this.formSubcategoria.reset();
    this.modalService.dismissAll();
    this.findByFilter();

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
    this.subcategoriaService.findAll().subscribe(listaSubcategorias =>{
      this.subcategorias = listaSubcategorias;
    },
    error =>{
      this.messageService.setErrorMesage(error);  
    });
    
    
  
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroSubcategoria.get('nome')?.value;
    
    this.subcategoriaService.findByFilter(nome, 0).subscribe(listaSubcategorias => this.subcategorias = listaSubcategorias);
    
  }

  //****************************************************************************/
  
  openAddModal(content: any) {
    this.data = {titulo: 'Incluir Subcategoria'};
    this.modalService.open(content, {ariaLabelledBy: 'modalSubcategoria'});
    
    this.formSubcategoria.setValue({
      id: '', 
      nome: '', 
      idCategoria: ''});

  }

  //****************************************************************************/
  openEditModal(content: any, subcategoriaDTO: SubcategoriaDTO) {
    this.data = {titulo: 'Alterar Subcategoria'};

    this.formSubcategoria.setValue({
      id: subcategoriaDTO.id, 
      nome: subcategoriaDTO.nome, 
      idCategoria: subcategoriaDTO.categoria.id});

    this.modalService.open(content, {ariaLabelledBy: 'modalSubcategoria'});
  }


}
