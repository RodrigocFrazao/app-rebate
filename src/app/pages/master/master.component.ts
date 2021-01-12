import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/services/commons/message.service';


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

  constructor(private messageService: MessageService) { }

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

}
