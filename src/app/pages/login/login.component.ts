import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { LoginDTO } from 'src/models/loginDTO';
import { LoginService } from 'src/services/login/login.service';



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

  alerts!: Alert[];

  
  formLogin: FormGroup = new FormGroup({
    login: new FormControl('rodrigo.dias'),
    senha: new FormControl('senha')
  })
  
  constructor( private router: Router
             , private loginService: LoginService) {              
    
  }
 
  
  ngOnInit(): void {    
  }

  //navegar para tela home
  goToHome() {
    this.router.navigate(['/home']);
  }
  
  
  //método para realizar o login
  login(){
    //copia os dados do form pro dto
    const loginDTO: LoginDTO = {...this.formLogin.value}
    
    this.loginService.login(loginDTO).subscribe(resp => {
          
          //armazena o token
          localStorage.setItem('token', resp.headers.get('Authorization'));

          this.goToHome();
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

          this.alerts = [{type: 'warning',message: msg}];
          
        })    
  }
  

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
