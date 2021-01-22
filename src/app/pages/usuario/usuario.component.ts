import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { UsuarioDTO } from 'src/models/usuarioDTO';
import { UsuarioService } from 'src/services/usuario/usuario.service';
import { MessageService } from 'src/services/commons/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../util/dialog/confirm-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfilDTO } from 'src/models/perfilDTO';


//interface usada para configurar a dialog de criação/edição de usuarios
export interface DialogData {
  titulo: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})

export class UsuarioComponent implements OnInit {

  data!: DialogData;

  usuarios: UsuarioDTO[] = [];

  perfis: PerfilDTO[] = [
    {codigo: 1, nome: 'MASTER'},
    {codigo: 2, nome: 'ADMIN'},
    {codigo: 3, nome: 'CADASTRO'},
    {codigo: 4, nome: 'CONSULTA'}
  ];

  formUsuario: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    login: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    senha: new FormControl(''),
    codigoPerfil: new FormControl('', [Validators.required]),
    isAtivo: new FormControl('')
    
  })

  formFiltroUsuario: FormGroup = new FormGroup({
    nome: new FormControl('')
  })
  
  //****************************************************************************/
  constructor( private usuarioService: UsuarioService
             , private messageService: MessageService
             , private dialog: MatDialog, private modalService: NgbModal) { }

  //****************************************************************************/           
  ngOnInit(): void {

    this.findAll();

  }

  //****************************************************************************/
  save(){

    //copia os dados do form pro dto
    const usuarioDTO: UsuarioDTO = {...this.formUsuario.value}
    
    console.log('id: ' + usuarioDTO.id);
    console.log('nome: ' + usuarioDTO.nome);
    console.log('login: ' + usuarioDTO.login);
    console.log('senha: ' + usuarioDTO.senha);
    console.log('perfil: ' + usuarioDTO.codigoPerfil);
    console.log('ativo: ' + usuarioDTO.isAtivo);
    
    if(usuarioDTO.id){ //edição
      
      this.usuarioService.update(usuarioDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Usuário alterado com sucesso!');
                
        //só chamar o findByFilter após receber a resposta da api
        while(!response){          
        }
        this.findByFilter();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      }); 


    }else{ //inclusão
      
      this.usuarioService.insert(usuarioDTO)
                           .subscribe(response => {

        this.messageService.setSucessMessage('Usuário incluído com sucesso!');
                
        //só chamar o findByFilter após receber a resposta da api
        while(!response){          
        }
        this.findByFilter();
      
      },
      error => {

        this.messageService.setErrorMesage(error);
        
      });   

    } 

    this.formUsuario.reset();
    this.modalService.dismissAll();    

  }

  //****************************************************************************/
  delete(usuarioDTO: UsuarioDTO){
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
          title: "Tem certeza?",
          mainMessage: "Você realmente deseja excluir o usuário ",
          detailMessage: usuarioDTO.nome,
          explanation: "Todo o histórico deste usuário será perdido",
          warning: "Esta operação não poderá ser desfeita!"
        }
    });
  

    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if(dialogResult){
            this.usuarioService.delete(usuarioDTO.id).subscribe(response => {

              this.messageService.setSucessMessage('Usuário excluído com sucesso!');
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
    this.usuarioService.findAll().subscribe(listaUsuarios => this.usuarios = listaUsuarios);
  }

  //****************************************************************************/
  findByFilter(){

    //copia os dados do form pra variavel
    const nome: string = this.formFiltroUsuario.get('nome')?.value;
    
    this.usuarioService.findByFilter(nome).subscribe(listaUsuarios => {
      this.usuarios = listaUsuarios;
    });
  }

  //****************************************************************************/
  
  openAddModal(content: any) {
    this.data = {titulo: 'Incluir Usuario'};
    this.modalService.open(content, {ariaLabelledBy: 'modalUsuario'});
  }

  //****************************************************************************/
  openEditModal(content: any, usuarioDTO: UsuarioDTO) {
    this.data = {titulo: 'Alterar Usuario'};

    this.formUsuario.setValue({
      id: usuarioDTO.id, 
      nome: usuarioDTO.nome,
      login: usuarioDTO.login,
      isAtivo: usuarioDTO.isAtivo,
      codigoPerfil: usuarioDTO.codigoPerfil,
      senha: usuarioDTO.senha
    });

    this.modalService.open(content, {ariaLabelledBy: 'modalUsuario'});
  }


}
