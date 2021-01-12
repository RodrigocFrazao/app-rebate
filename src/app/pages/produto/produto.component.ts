import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { ProdutoDTO } from 'src/models/produtoDTO';
import { ProdutoService } from 'src/services/produto/produto.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
  produtos: ProdutoDTO[] = [];

  formProduto: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('')
  })

  formFiltroProduto: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private produtoService: ProdutoService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { }

  //****************************************************************************/           
  ngOnInit(): void {

    this.findAll();

  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const produtoDTO: ProdutoDTO = {...this.formProduto.value}
    
    if(produtoDTO.id){ //edição
      
      this.produtoService.update(produtoDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Produto alterado com sucesso!');
        this.produtos.push(response.body);
        this.formProduto.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.produtoService.insert(produtoDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Produto incluído com sucesso!');
        this.produtos.push(response.body);
        this.formProduto.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 
    this.modalService.dismissAll();
    this.findAll();

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
    this.produtoService.findAll().subscribe(listaProdutos => this.produtos = listaProdutos);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroProduto.get('nome')?.value;
    
    this.produtoService.findByFilter(nome).subscribe(listaProdutos => this.produtos = listaProdutos);
  }

  //****************************************************************************/
  closeResult = '';
  openAddModal(content: any) {
    this.data = {titulo: 'Incluir Produto'};
    this.modalService.open(content, {ariaLabelledBy: 'modalProduto'});
  }

  //****************************************************************************/
  openEditModal(content: any, produtoDTO: ProdutoDTO) {
    this.data = {titulo: 'Alterar Produto'};

    this.formProduto.setValue({id: produtoDTO.id, nome: produtoDTO.nome});
    this.modalService.open(content, {ariaLabelledBy: 'modalProduto'});
  }


}
