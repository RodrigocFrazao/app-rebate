import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { LinhaProdutoDTO } from 'src/models/linhaProdutoDTO';
import { LinhaProdutoService } from 'src/services/linhaProduto/linha-produto.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaService } from 'src/services/categoria/categoria.service';
import { SubcategoriaService } from 'src/services/subcategoria/subcategoria.service';
import { FabricanteService } from 'src/services/fabricante/fabricante.service';
import { FabricanteDTO } from 'src/models/fabricanteDTO';
import { SubcategoriaDTO } from 'src/models/subcategoriaDTO';
import { CategoriaDTO } from 'src/models/categoriaDTO';


//interface usada para configurar a dialog de criação/edição de linhasProdutos
export interface DialogData {
  titulo: string;
}

@Component({
  selector: 'app-linha-produto',
  templateUrl: './linha-produto.component.html',
  styleUrls: ['./linha-produto.component.css']
})

export class LinhaProdutoComponent implements OnInit {

  data!: DialogData;

  linhasProdutos: LinhaProdutoDTO[] = [];
  categorias: CategoriaDTO[] = [];
  subcategorias: SubcategoriaDTO[] = []
  fabricantes: FabricanteDTO[] = [];

  formLinhaProduto: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    idCategoria: new FormControl('', Validators.required),
    idSubcategoria: new FormControl('', Validators.required),
    idFabricante: new FormControl('', Validators.required)
  })

  formFiltroLinhaProduto: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private linhaProdutoService: LinhaProdutoService
             , private categoriaService: CategoriaService
             , private subcategoriaService: SubcategoriaService
             , private fabricanteService: FabricanteService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { }

  //****************************************************************************/           
  ngOnInit(): void {

    this.categoriaService.findAll().subscribe(listaCategorias => this.categorias = listaCategorias);
    this.fabricanteService.findAll().subscribe(listaFabricantes => this.fabricantes = listaFabricantes);
    this.findAll();

  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const linhaProdutoDTO: LinhaProdutoDTO = {...this.formLinhaProduto.value}
    
    //categoria
    let catDTO: CategoriaDTO = new CategoriaDTO();
    catDTO = {
      id: this.formLinhaProduto.get('idCategoria')?.value,
      nome: ''
    };

    //subcategoria
    let scatDTO: SubcategoriaDTO = new SubcategoriaDTO();
    scatDTO = {
      id: this.formLinhaProduto.get('idSubcategoria')?.value,
      nome: '',
      categoria: catDTO
    };

    //fabricante
    let fabDTO: FabricanteDTO = new FabricanteDTO();
    fabDTO = {
      id: this.formLinhaProduto.get('idFabricante')?.value,
      nome: ''
    };

    linhaProdutoDTO.subcategoria = scatDTO;
    linhaProdutoDTO.fabricante = fabDTO;
    
    if(linhaProdutoDTO.id){ //edição
      
      this.linhaProdutoService.update(linhaProdutoDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Linha de Produto alterada com sucesso!');
        
        //só chamar o findByFilter após receber a resposta da api
        while(!response){          
        }
        this.findByFilter();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.linhaProdutoService.insert(linhaProdutoDTO).subscribe(response => {

        this.messageService.setSucessMessage('Linha de Produto incluída com sucesso!');
        
        //só chamar o findByFilter após receber a resposta da api
        while(!response){          
        }
        this.findByFilter();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 

    this.formLinhaProduto.reset();
    this.modalService.dismissAll();
    
  }

  //****************************************************************************/
  delete(linhaProdutoDTO: LinhaProdutoDTO){
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
          title: "Tem certeza?",
          mainMessage: "Você realmente deseja excluir a linhaProduto ",
          detailMessage: linhaProdutoDTO.nome,
          explanation: "Todo o histórico desta linhaProduto será perdido",
          warning: "Esta operação não poderá ser desfeita!"
        }
    });
  

    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if(dialogResult){
            this.linhaProdutoService.delete(linhaProdutoDTO.id).subscribe(response => {

              this.messageService.setSucessMessage('Linha de Produto excluída com sucesso!');
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
    this.linhaProdutoService.findAll().subscribe(listaLinhaProdutos => this.linhasProdutos = listaLinhaProdutos);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroLinhaProduto.get('nome')?.value;
    
    this.linhaProdutoService.findByFilter(nome,0,0).subscribe(listaLinhaProdutos => this.linhasProdutos = listaLinhaProdutos);
  }

  //****************************************************************************/
  findSubcategoriaByFilter(){

    //copia os dados do form pra variavel
    const idCategoria: number = this.formLinhaProduto.get('idCategoria')?.value;
    
    this.subcategoriaService.findByFilter('', idCategoria).subscribe(listaSubcategorias => this.subcategorias = listaSubcategorias);
  }

  //****************************************************************************/
  openAddModal(content: any) {
    this.data = {titulo: 'Incluir LinhaProduto'};
    this.modalService.open(content, {ariaLabelledBy: 'modalLinhaProduto'});
  }

  //****************************************************************************/
  openEditModal(content: any, linhaProdutoDTO: LinhaProdutoDTO) {
    this.data = {titulo: 'Alterar LinhaProduto'};

    this.formLinhaProduto.setValue({id: linhaProdutoDTO.id, nome: linhaProdutoDTO.nome});

    this.formLinhaProduto.setValue({
      id: linhaProdutoDTO.id, 
      nome: linhaProdutoDTO.nome,
      idCategoria: linhaProdutoDTO.subcategoria.categoria.id,
      idSubcategoria: linhaProdutoDTO.subcategoria.id,
      idFabricante: linhaProdutoDTO.fabricante.id
    });

    this.findSubcategoriaByFilter();
    
    this.modalService.open(content, {ariaLabelledBy: 'modalLinhaProduto'});
  }


}
