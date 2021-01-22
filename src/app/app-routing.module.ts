import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MasterComponent } from './pages/master/master.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { SubcategoriaComponent } from './pages/subcategoria/subcategoria.component';
import { FabricanteComponent } from './pages/fabricante/fabricante.component';
import { LinhaProdutoComponent } from './pages/linha-produto/linha-produto.component';
import { ModeloComponent } from './pages/modelo/modelo.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { RebateComponent } from './pages/rebate/rebate.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: MasterComponent, 
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'categoria', component: CategoriaComponent },
      { path: 'subcategoria', component: SubcategoriaComponent },
      { path: 'fabricante', component: FabricanteComponent },
      { path: 'linhaProduto', component: LinhaProdutoComponent },
      { path: 'modelo', component: ModeloComponent },
      { path: 'produto', component: ProdutoComponent },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'rebate', component: RebateComponent },      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
