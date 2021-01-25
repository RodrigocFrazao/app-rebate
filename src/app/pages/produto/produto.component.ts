import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { ProdutoDTO } from 'src/models/produtoDTO';
import { ProdutoService } from 'src/services/produto/produto.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModeloDTO } from 'src/models/modeloDTO';
import { FabricanteDTO } from 'src/models/fabricanteDTO';
import { SubcategoriaDTO } from 'src/models/subcategoriaDTO';
import { CategoriaDTO } from 'src/models/categoriaDTO';
import { CodigoBarrasDTO } from 'src/models/codigoBarrasDTO';
import { LinhaProdutoDTO } from 'src/models/linhaProdutoDTO';
import { LinhaProdutoService } from 'src/services/linhaProduto/linha-produto.service';
import { FabricanteService } from 'src/services/fabricante/fabricante.service';
import { SubcategoriaService } from 'src/services/subcategoria/subcategoria.service';
import { CategoriaService } from 'src/services/categoria/categoria.service';
import { ModeloService } from 'src/services/modelo/modelo.service';
import { CodigoBarrasService } from 'src/services/codigoBarras/codigo-barras.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


//interface usada para configurar a dialog de criação/edição de produtos
export interface DialogData {
  titulo: string;
}

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})



export class ProdutoComponent implements OnInit {

  data!: DialogData;
  categorias: CategoriaDTO[] = [];
  subcategorias: SubcategoriaDTO[] = []
  fabricantes: FabricanteDTO[] = [];
  linhasProdutos: LinhaProdutoDTO[] = [];
  modelos: ModeloDTO[] = [];
  produtos: ProdutoDTO[] = [];

  formProduto: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('', Validators.required),
    idCategoria: new FormControl('', Validators.required),
    nomeCategoria: new FormControl(''),
    idSubcategoria: new FormControl('', Validators.required),
    nomeSubcategoria: new FormControl(''),
    idFabricante: new FormControl('', Validators.required),
    nomeFabricante: new FormControl(''),
    idLinhaProduto: new FormControl('', Validators.required),
    nomeLinhaProduto: new FormControl(''),
    idModelo: new FormControl('', Validators.required),
    nomeModelo: new FormControl(''),
    idCodigoBarras: new FormControl(''),
    codigoBarras: new FormControl(''),
  })

  formFiltroProduto: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private produtoService: ProdutoService
             , private codigoBarrasService: CodigoBarrasService
             , private categoriaService: CategoriaService
             , private subcategoriaService: SubcategoriaService
             , private fabricanteService: FabricanteService
             , private linhaProdutoService: LinhaProdutoService
             , private modeloService: ModeloService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { 
           
  }

  //****************************************************************************/           
  ngOnInit(): void {

    this.categoriaService.findAll().subscribe(listaCategorias => this.categorias = listaCategorias);
    this.fabricanteService.findAll().subscribe(listaFabricantes => this.fabricantes = listaFabricantes);
    this.findAll();

  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const produtoDTO: ProdutoDTO = {...this.formProduto.value}
    
    //categoria
    let catDTO: CategoriaDTO = new CategoriaDTO();
    catDTO = {
      id: this.formProduto.get('idCategoria')?.value,
      nome: ''
    };

    //subcategoria
    let scatDTO: SubcategoriaDTO = new SubcategoriaDTO();
    scatDTO = {
      id: this.formProduto.get('idSubcategoria')?.value,
      nome: '',
      categoria: catDTO
    };

    //fabricante
    let fabDTO: FabricanteDTO = new FabricanteDTO();
    fabDTO = {
      id: this.formProduto.get('idFabricante')?.value,
      nome: ''
    };

    //linha do produto
    let lpDTO: LinhaProdutoDTO = new LinhaProdutoDTO();
    lpDTO = {
      id: this.formProduto.get('idLinhaProduto')?.value,
      nome: '',
      subcategoria: scatDTO,
      fabricante: fabDTO
    };

    //modelo
    let mDTO: ModeloDTO = new ModeloDTO();
    mDTO = {
      id: this.formProduto.get('idModelo')?.value,
      nome: '',
      linhaProduto: lpDTO
    }

    produtoDTO.modelo = mDTO;

    if(produtoDTO.id){ //edição
      
      this.produtoService.update(produtoDTO)
                         .subscribe(response => {

        this.messageService.setSucessMessage('Produto alterado com sucesso!');

        //só chamar o findByFilter após receber a resposta da api
        while(!response){          
        }
        this.findByFilter();
              
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.produtoService.insert(produtoDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Produto incluído com sucesso!');

        //só chamar o findByFilter após receber a resposta da api
        while(!response){          
        }
        this.findByFilter();
              
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   
    }
    
    this.modalService.dismissAll();
    this.formProduto.reset();
    
  }

  //****************************************************************************/
  saveCodigoBarras(){

    //preenche o produto de acordo com o form
    const produtoDTO: ProdutoDTO =   {...this.formProduto.value}
    
    //categoria
    let cbDTO: CodigoBarrasDTO = new CodigoBarrasDTO();
    cbDTO = {
      id: this.formProduto.get('idCodigoBarras')?.value,
      codigo: this.formProduto.get('codigoBarras')?.value,
      produto: produtoDTO
    };

    
    if(cbDTO.id){ //edição
      
      this.codigoBarrasService.update(cbDTO)
                              .subscribe(response => {

        this.messageService.setSucessMessage('Código de barras alterado com sucesso!');
        //só chamar o findByFilter após receber a resposta da api
        while(!response){          
        }
        this.findByFilter();

      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 
     

    }else{ //inclusão
      
      this.codigoBarrasService.insert(cbDTO)
                              .subscribe(response => {

        this.messageService.setSucessMessage('Código de Barras incluído com sucesso!');
        //só chamar o findByFilter após receber a resposta da api
        while(!response){          
        }
        this.findByFilter();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 
    
    this.formProduto.reset();
    this.modalService.dismissAll();
    

  }

  //****************************************************************************/
  delete(produtoDTO: ProdutoDTO){
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
          title: "Tem certeza?",
          mainMessage: "Você realmente deseja excluir o produto ",
          detailMessage: produtoDTO.nome,
          explanation: "Todo o histórico deste produto será perdido",
          warning: "Esta operação não poderá ser desfeita!"
        }
    });
  

    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if(dialogResult){
            this.produtoService.delete(produtoDTO.id).subscribe(response => {

              this.messageService.setSucessMessage('Produto excluído com sucesso!');
              this.findByFilter();
            },
            error => {
              this.messageService.setErrorMesage(error);
            });
      }
      
    });
      
  }

  //****************************************************************************/
  deleteCodigoBarras(codigoBarrasDTO: CodigoBarrasDTO){
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
          title: "Tem certeza?",
          mainMessage: "Você realmente deseja excluir o código de barras ",
          detailMessage: codigoBarrasDTO.codigo,
          explanation: "Todo o histórico deste código será perdido",
          warning: "Esta operação não poderá ser desfeita!"
        }
    });
  

    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if(dialogResult){
            this.codigoBarrasService.delete(codigoBarrasDTO.id).subscribe(response => {

              this.messageService.setSucessMessage('Código de Barras excluído com sucesso!');
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
    this.produtoService.findAll().subscribe(listaProdutos => this.produtos = listaProdutos);
  }

  //****************************************************************************/
  findSubcategoriaByFilter(){

    //copia os dados do form pra variavel
    const idCategoria: number = this.formProduto.get('idCategoria')?.value;
    
    this.subcategoriaService.findByFilter('', idCategoria).subscribe(listaSubcategorias => this.subcategorias = listaSubcategorias);
  }

  //****************************************************************************/
  findLinhaProdutoByFilter(){

    //copia os dados do form pra variavel
    const idFabricante: number = this.formProduto.get('idFabricante')?.value;
    const idSubcategoria: number = this.formProduto.get('idSubcategoria')?.value;
    
    this.linhaProdutoService.findByFilter('', idSubcategoria, idFabricante).subscribe(listaLinhasProdutos => this.linhasProdutos = listaLinhasProdutos);
  }

   //****************************************************************************/
   findModeloByFilter(){

    //copia os dados do form pra variavel
    const idLinhaProduto: number = this.formProduto.get('idLinhaProduto')?.value;
    
    this.modeloService.findByFilter('', idLinhaProduto).subscribe(listaModelos => this.modelos = listaModelos);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroProduto.get('nome')?.value;
    this.produtoService.findByFilter(nome).subscribe(listaProdutos => this.produtos = listaProdutos);
  }

  //****************************************************************************/
  openAddProduto(content: any) {
    this.data = {titulo: 'Incluir Produto'};
    this.modalService.open(content, {ariaLabelledBy: 'modalProduto'});
  }

  //****************************************************************************/
  openEditProduto(content: any, produtoDTO: ProdutoDTO) {
    this.data = {titulo: 'Alterar Produto'};

    this.formProduto.setValue({
      id: produtoDTO.id, 
      nome: produtoDTO.nome,
      idCategoria: produtoDTO.modelo.linhaProduto.subcategoria.categoria.id,
      nomeCategoria: produtoDTO.modelo.linhaProduto.subcategoria.categoria.nome,
      idSubcategoria: produtoDTO.modelo.linhaProduto.subcategoria.id,
      nomeSubcategoria: produtoDTO.modelo.linhaProduto.subcategoria.nome,
      idFabricante: produtoDTO.modelo.linhaProduto.fabricante.id,
      nomeFabricante: produtoDTO.modelo.linhaProduto.fabricante.nome,
      idLinhaProduto: produtoDTO.modelo.linhaProduto.id,
      nomeLinhaProduto: produtoDTO.modelo.linhaProduto.nome,
      idModelo: produtoDTO.modelo.id,
      nomeModelo: produtoDTO.modelo.nome,
      idCodigoBarras: null,
      codigoBarras: ''
    });

    this.findSubcategoriaByFilter();
    this.findLinhaProdutoByFilter();
    this.findModeloByFilter();

    this.modalService.open(content, {ariaLabelledBy: 'modalProduto'});
  }

  //****************************************************************************/
  openAddCodigoBarras(content: any, produtoDTO: ProdutoDTO) {
    this.data = {titulo: 'Incluir Código de Barras'};

    this.formProduto.setValue({
      id: produtoDTO.id, 
      nome: produtoDTO.nome,
      idCategoria: produtoDTO.modelo.linhaProduto.subcategoria.categoria.id,
      nomeCategoria: produtoDTO.modelo.linhaProduto.subcategoria.categoria.nome,
      idSubcategoria: produtoDTO.modelo.linhaProduto.subcategoria.id,
      nomeSubcategoria: produtoDTO.modelo.linhaProduto.subcategoria.nome,
      idFabricante: produtoDTO.modelo.linhaProduto.fabricante.id,
      nomeFabricante: produtoDTO.modelo.linhaProduto.fabricante.nome,
      idLinhaProduto: produtoDTO.modelo.linhaProduto.id,
      nomeLinhaProduto: produtoDTO.modelo.linhaProduto.nome,
      idModelo: produtoDTO.modelo.id,
      nomeModelo: produtoDTO.modelo.nome,
      idCodigoBarras: null,
      codigoBarras: ''
    });

    this.modalService.open(content, {ariaLabelledBy: 'modalCodigoBarras'});
  }

  //****************************************************************************/
  openEditCodigoBarras(content: any, produtoDTO: ProdutoDTO, codigoBarrasDTO: CodigoBarrasDTO) {
    this.data = {titulo: 'Alterar Código de Barras'};

    this.formProduto.setValue({
      id: produtoDTO.id, 
      nome: produtoDTO.nome,
      idCategoria: produtoDTO.modelo.linhaProduto.subcategoria.categoria.id,
      nomeCategoria: produtoDTO.modelo.linhaProduto.subcategoria.categoria.nome,
      idSubcategoria: produtoDTO.modelo.linhaProduto.subcategoria.id,
      nomeSubcategoria: produtoDTO.modelo.linhaProduto.subcategoria.nome,
      idFabricante: produtoDTO.modelo.linhaProduto.fabricante.id,
      nomeFabricante: produtoDTO.modelo.linhaProduto.fabricante.nome,
      idLinhaProduto: produtoDTO.modelo.linhaProduto.id,
      nomeLinhaProduto: produtoDTO.modelo.linhaProduto.nome,
      idModelo: produtoDTO.modelo.id,
      nomeModelo: produtoDTO.modelo.nome,
      idCodigoBarras: codigoBarrasDTO.id,
      codigoBarras: codigoBarrasDTO.codigo
    });

    this.modalService.open(content, {ariaLabelledBy: 'modalCodigoBarras'});
  }


}
