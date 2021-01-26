import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { LoginDTO } from 'src/models/loginDTO';
import { LoginService } from 'src/services/login/login.service';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioDTO } from 'src/models/usuarioDTO';
import { UsuarioService } from 'src/services/usuario/usuario.service';


//interface usada para configurar a dialog de criação/edição de usuarios
export interface DialogData {
  titulo: string;
}



interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit {

  data!: DialogData;
  alerts!: Alert[];

  
  formLogin: FormGroup = new FormGroup({
    login: new FormControl('rodrigo.dias',[Validators.required]),
    senha: new FormControl('senha', [Validators.required])
  })
  
  formPrimeiroAcesso: FormGroup = new FormGroup({
    id: new FormControl('',[Validators.required]),
    login: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required]),
    isAtivo: new FormControl('',[Validators.required]),
    codigoPerfil: new FormControl('',[Validators.required]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmacaoSenha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    ultimoAcesso: new FormControl('')
  })

  constructor( private router: Router
             , private loginService: LoginService
             , private modalService: NgbModal
             , private usuarioService: UsuarioService) {              
    
  }
 
  
  ngOnInit(): void {    
  }

  //navegar para tela home
  goToHome() {
    this.router.navigate(['/home']);
  }
  
  
  //método para realizar o login
  login(modalPrimeiroAcesso: any){
    //copia os dados do form pro dto
    const loginDTO: LoginDTO = {...this.formLogin.value}
    
    this.loginService.login(loginDTO).subscribe(resp => {
          
          //armazena o token
          localStorage.setItem('token', resp.headers.get('Authorization'));
          
          let usuarioDTO: UsuarioDTO = {
            id: resp.body.id,
            nome: resp.body.nome,
            login: resp.body.login,
            email: resp.body.email,
            isAtivo: resp.body.isAtivo,
            senha: resp.body.senha,
            ultimoAcesso: resp.body.ultimoAcesso,
            codigoPerfil: resp.body.codigoPerfil
          }


          //valida se é o primeiro acesso
          if(resp.body.ultimoAcesso == null){
            this.openModalPrimeiroAcesso(modalPrimeiroAcesso, usuarioDTO);
          }else{

            //armazena o usuario
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioDTO));
            this.goToHome();
          }

          

        },
        error => {
          
          let errorObj = error;
          if (errorObj.error) {
            errorObj = errorObj.error;
          }
          
          let msg = '';

          if(errorObj.error){
            msg += errorObj.error + " - ";
          }

          msg += errorObj.message;

          if(error.error.error.indexOf('Não autorizado')>=0){

            this.alerts = [{type: 'danger',message: error.error.message}];

          }else if(error.message.indexOf('Http failure response')>=0){
            //banco de dados fora do ar ou falha na rede

            msg = 'Erro na conexão com o serviço de autenticação.'
            this.alerts = [{type: 'danger',message: msg}];
          }else{
            this.alerts = [{type: 'warning',message: msg}];
          }

          
          
        })    
  }
  

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }


  //****************************************************************************/
  openModalPrimeiroAcesso(content: any, usuarioDTO: UsuarioDTO) {
    this.data = {titulo: 'Alterar Senha'};

    this.formPrimeiroAcesso.setValue({
      id: usuarioDTO.id, 
      login: usuarioDTO.login,
      email: usuarioDTO.email,
      isAtivo: usuarioDTO.isAtivo,
      codigoPerfil: usuarioDTO.codigoPerfil,
      senha: '',
      confirmacaoSenha: '',
      ultimoAcesso: new Date
    });

    this.modalService.open(content, {ariaLabelledBy: 'modalPrimeiroAcesso'});
  }

  //****************************************************************************/
  alterarSenha(){

    //copia os dados do form pro dto
    const usuarioDTO: UsuarioDTO = {...this.formPrimeiroAcesso.value}
    
    
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
