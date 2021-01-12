import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { LinhaProdutoDTO } from 'src/models/linhaProdutoDTO';
import { LinhaProdutoService } from 'src/services/linhaProduto/linha-produto.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


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

  formLinhaProduto: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('')
  })

  formFiltroLinhaProduto: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private router: Router
             , private linhaProdutoService: LinhaProdutoService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { }

  //****************************************************************************/           
  ngOnInit(): void {

    this.findAll();

  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const linhaProdutoDTO: LinhaProdutoDTO = {...this.formLinhaProduto.value}
    
    if(linhaProdutoDTO.id){ //edição
      
      this.linhaProdutoService.update(linhaProdutoDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('LinhaProduto alterada com sucesso!');
        this.linhasProdutos.push(response.body);
        this.formLinhaProduto.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.linhaProdutoService.insert(linhaProdutoDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('LinhaProduto incluída com sucesso!');
        this.linhasProdutos.push(response.body);
        this.formLinhaProduto.reset();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 
    this.modalService.dismissAll();
    this.findAll();

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

              this.messageService.setSucessMessage('LinhaProduto excluída com sucesso!');
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
    this.linhaProdutoService.findAll().subscribe(listaLinhaProdutos => this.linhasProdutos = listaLinhaProdutos);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroLinhaProduto.get('nome')?.value;
    
    this.linhaProdutoService.findByFilter(nome).subscribe(listaLinhaProdutos => this.linhasProdutos = listaLinhaProdutos);
  }

  //****************************************************************************/
  closeResult = '';
  openAddModal(content: any) {
    this.data = {titulo: 'Incluir LinhaProduto'};
    this.modalService.open(content, {ariaLabelledBy: 'modalLinhaProduto'});
  }

  //****************************************************************************/
  openEditModal(content: any, linhaProdutoDTO: LinhaProdutoDTO) {
    this.data = {titulo: 'Alterar LinhaProduto'};

    this.formLinhaProduto.setValue({id: linhaProdutoDTO.id, nome: linhaProdutoDTO.nome});
    this.modalService.open(content, {ariaLabelledBy: 'modalLinhaProduto'});
  }


}
