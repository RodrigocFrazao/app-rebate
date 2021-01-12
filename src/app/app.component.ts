import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './pages/app.component.html',
  styleUrls: ['./pages/app.component.css']
})
export class AppComponent {
  
  constructor(

    private router: Router,
    
  ) { }
 
  
  ngOnInit(): void {
    this.router.navigate(['login']);
  }

  
  
}
