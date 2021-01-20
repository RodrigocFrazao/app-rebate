import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { ModeloDTO } from 'src/models/modeloDTO';
import { ModeloService } from 'src/services/modelo/modelo.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LinhaProdutoDTO } from 'src/models/linhaProdutoDTO';
import { CategoriaDTO } from 'src/models/categoriaDTO';
import { SubcategoriaDTO } from 'src/models/subcategoriaDTO';
import { FabricanteDTO } from 'src/models/fabricanteDTO';
import { LinhaProdutoService } from 'src/services/linhaProduto/linha-produto.service';
import { FabricanteService } from 'src/services/fabricante/fabricante.service';
import { SubcategoriaService } from 'src/services/subcategoria/subcategoria.service';
import { CategoriaService } from 'src/services/categoria/categoria.service';


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
  linhasProdutos: LinhaProdutoDTO[] = [];
  categorias: CategoriaDTO[] = [];
  subcategorias: SubcategoriaDTO[] = []
  fabricantes: FabricanteDTO[] = [];

  
  formModelo: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    idCategoria: new FormControl('', Validators.required),
    idSubcategoria: new FormControl('', Validators.required),
    idFabricante: new FormControl('', Validators.required),
    idLinhaProduto: new FormControl('', Validators.required)
  })

  formFiltroModelo: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private modeloService: ModeloService
             , private categoriaService: CategoriaService
             , private subcategoriaService: SubcategoriaService
             , private fabricanteService: FabricanteService
             , private linhaProdutoService: LinhaProdutoService
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
    const modeloDTO: ModeloDTO = {...this.formModelo.value}
    
    //categoria
    let catDTO: CategoriaDTO = new CategoriaDTO();
    catDTO = {
      id: this.formModelo.get('idCategoria')?.value,
      nome: ''
    };

    //subcategoria
    let scatDTO: SubcategoriaDTO = new SubcategoriaDTO();
    scatDTO = {
      id: this.formModelo.get('idSubcategoria')?.value,
      nome: '',
      categoria: catDTO
    };

    //fabricante
    let fabDTO: FabricanteDTO = new FabricanteDTO();
    fabDTO = {
      id: this.formModelo.get('idFabricante')?.value,
      nome: ''
    };

    //fabricante
    let lpDTO: LinhaProdutoDTO = new LinhaProdutoDTO();
    lpDTO = {
      id: this.formModelo.get('idLinhaProduto')?.value,
      nome: '',
      fabricante: fabDTO,
      subcategoria: scatDTO
    };

    modeloDTO.linhaProduto = lpDTO;

    if(modeloDTO.id){ //edição
      
      this.modeloService.update(modeloDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Modelo alterado com sucesso!');
        this.formModelo.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.modeloService.insert(modeloDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Modelo incluído com sucesso!');
        this.formModelo.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 
    this.modalService.dismissAll();
    this.findByFilter();

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
    this.modeloService.findAll().subscribe(listaModelos => this.modelos = listaModelos);
  }

  //****************************************************************************/
  findSubcategoriaByFilter(){

    //copia os dados do form pra variavel
    const idCategoria: number = this.formModelo.get('idCategoria')?.value;
    
    this.subcategoriaService.findByFilter('', idCategoria).subscribe(listaSubcategorias => this.subcategorias = listaSubcategorias);
  }

  //****************************************************************************/
  findLinhaProdutoByFilter(){

    //copia os dados do form pra variavel
    const idSubcategoria: number = this.formModelo.get('idSubcategoria')?.value;
    const idFabricante: number = this.formModelo.get('idFabricante')?.value;
    
    this.linhaProdutoService.findByFilter('', idSubcategoria, idFabricante).subscribe(listaLinhasProdutos => this.linhasProdutos = listaLinhasProdutos);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroModelo.get('nome')?.value;
    
    this.modeloService.findByFilter(nome,0).subscribe(listaModelos => this.modelos = listaModelos);
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

    this.formModelo.setValue({
      id: modeloDTO.id, 
      nome: modeloDTO.nome,
      idCategoria: modeloDTO.linhaProduto.subcategoria.categoria.id,
      idSubcategoria: modeloDTO.linhaProduto.subcategoria.id,
      idFabricante: modeloDTO.linhaProduto.fabricante.id,
      idLinhaProduto: modeloDTO.linhaProduto.id
    });

    this.findSubcategoriaByFilter();
    this.findLinhaProdutoByFilter();
    this.modalService.open(content, {ariaLabelledBy: 'modalModelo'});
  }


}
