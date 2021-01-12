import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  mainMessage: string;
  detailMessage: string;
  explanation: string;
  warning: string;
}

@Component({
  selector: './app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})


export class ConfirmDialogComponent implements OnInit {

  dialogData!: DialogData;
  confirmou: boolean = false;

  constructor( public dialogRef: MatDialogRef<ConfirmDialogComponent>
             , @Inject(MAT_DIALOG_DATA) public data: DialogData) {
              
  }

  filterData: any;

  ngOnInit(){
  }

  onConfirm(): void{
    //fecha a dialog e retorna true
    this.dialogRef.close(true);
  }

  onDismiss(): void{
    //fecha a dialog e retorna false
    this.dialogRef.close(false);
  }

}
