import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioDTO } from 'src/models/usuarioDTO';
import { MessageService } from 'src/services/commons/message.service';
import { UsuarioService } from 'src/services/usuario/usuario.service';
import { DialogData } from '../login/login.component';



interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

  alerts!: Alert[];
  data!: DialogData;
  
  formAlterarSenha: FormGroup = new FormGroup({
    id: new FormControl('',[Validators.required]),
    login: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required]),
    isAtivo: new FormControl('',[Validators.required]),
    codigoPerfil: new FormControl('',[Validators.required]),
    senhaAtual: new FormControl('', [Validators.required, Validators.minLength(8)]),
    novaSenha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmacaoNovaSenha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    ultimoAcesso: new FormControl('')
  })

  constructor( private messageService: MessageService
             , private modalService: NgbModal
             , private usuarioService: UsuarioService) { }

  ngOnInit(): void {

    //fica escutando o método e quando ouver mensagem a exibe na div de mensagens na tela
    this.messageService.getReceivedMessage().subscribe( msg =>{
      this.showAlert(msg.type, msg.message);
    })
  }

  showAlert(messageType: string, messageText: string){
    this.alerts = [{type: messageType, message: messageText}];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
    
  }


   //****************************************************************************/
   openModalAlterarSenha(content: any) {
    this.data = {titulo: 'Alterar Senha'};

    let usuarioDTO = JSON.parse( localStorage.getItem('usuarioLogado') || '{}');

    
    this.formAlterarSenha.setValue({
      id: usuarioDTO.id, 
      login: usuarioDTO.login,
      email: usuarioDTO.email,
      isAtivo: usuarioDTO.isAtivo,
      codigoPerfil: usuarioDTO.codigoPerfil,
      senhaAtual: '',
      novaSenha: '',
      confirmacaoNovaSenha: '',
      ultimoAcesso: new Date
    });

    this.modalService.open(content, {ariaLabelledBy: 'modalAlterarSenha'});
  }

  
  //****************************************************************************/
  alterarSenha(){

    //copia os dados do form pro dto
    const usuarioDTO: UsuarioDTO = {...this.formAlterarSenha.value}
    
    

    if(usuarioDTO.id){ //edição
      
      this.usuarioService.update(usuarioDTO)
                         .subscribe(response => {

        
        this.alerts = [{type: 'success',message: "Senha alterada com sucesso!"}];
                
        
      },
      error => {

        this.alerts = [{type: 'danger',message: "Ocorreu um erro ao alterar a senha. Por favor tente novamente.<br> " + error.message }];
        
      }); 


    }

    this.modalService.dismissAll();    

  }


  //****************************************************************************/
  alterarSenha(){

    //copia os dados do form pro dto
    const usuarioDTO: UsuarioDTO = {...this.formAlterarSenha.value}
    
    
    if(usuarioDTO.id){ //edição
      
      this.usuarioService.update(usuarioDTO)
                         .subscribe(response => {

        
        this.alerts = [{type: 'success',message: "Senha alterada com sucesso!"}];
                
        
      },
      error => {

        this.alerts = [{type: 'danger',message: "Ocorreu um erro ao alterar a senha. Por favor tente novamente.<br> " + error.message }];
        
      }); 


    }

    this.modalService.dismissAll();    

  }

}
