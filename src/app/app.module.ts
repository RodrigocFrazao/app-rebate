import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { MasterComponent } from './pages/master/master.component';
import { HomeComponent } from './pages/home/home.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { SubcategoriaComponent } from './pages/subcategoria/subcategoria.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { LinhaProdutoComponent } from './pages/linha-produto/linha-produto.component';
import { ModeloComponent } from './pages/modelo/modelo.component';
import { FabricanteComponent } from './pages/fabricante/fabricante.component';
import { RebateComponent } from './pages/rebate/rebate.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpConfigInterceptor } from '../interceptor/httpconfig.interceptor';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './pages/util/dialog/confirm-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MasterComponent,
    HomeComponent,
    ReportsComponent,
    CategoriaComponent,
    SubcategoriaComponent,
    ProdutoComponent,
    LinhaProdutoComponent,
    ModeloComponent,
    FabricanteComponent,
    RebateComponent,
    ConfirmDialogComponent,        
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxBootstrapIconsModule.pick(allIcons),
    MatDialogModule,
    NgSelectModule, 
    FormsModule     
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
