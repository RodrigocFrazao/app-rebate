import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';



interface Alert {
  type: string;
  message: string;
}


@Injectable({
  providedIn: 'root'
})

export class MessageService {

  private subject = new Subject<Alert>();

  constructor() {
    
  }

  /*
  quando algum componente da aplicação aciona este método ele recebe a mensagem enviada pelo componente
  e faz a transmissão da mesma através do método receiveMessage
   */
  setMessage(messageType: string, messageText:string){
    
    let alert: Alert = {type: messageType,message: messageText};
    this.subject.next(alert);
  }

  setSucessMessage(messageText:string){
    
    let alert: Alert = {type: 'success',message: messageText};
    this.subject.next(alert);
  }

  /*
  este método é usado para receber as mensagens em algum componente

  no init do componente da página master existe uma chamada para este método para receber as mensagens
  de erro e sucesso geradas nas demais páginas
   */
  getReceivedMessage(): Observable<Alert>{
    return this.subject.asObservable();
  }


  setErrorMesage(error: HttpErrorResponse){
    
    let errorObj = error;
    if (errorObj.error) {
      errorObj = errorObj.error;
    }
          
    let msg = '';

    if(errorObj.error){
      msg += errorObj.error + " - ";
    }

    if(errorObj.message){
      msg += errorObj.message;
    }else if(error.error.msg){
      msg += error.error.msg;
    }

    this.setMessage('warning', msg);
    
  }
}
