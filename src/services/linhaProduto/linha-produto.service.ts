import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONFIG } from 'src/config/api.config';
import { LinhaProdutoDTO } from 'src/models/linhaProdutoDTO';

@Injectable({
  providedIn: 'root'
})
export class LinhaProdutoService {

  constructor(private http: HttpClient){ 
  }

  insert(linhaProdutoDTO: LinhaProdutoDTO) : Observable<any> {

    return this.http.post<any>( API_CONFIG.baseURL+'/linhasprodutos'
                              , linhaProdutoDTO
                              , { observe: 'response' });

  }

  update(linhaProdutoDTO: LinhaProdutoDTO) : Observable<any> {

    console.log('linhaProdutoDTO: ' + linhaProdutoDTO);

    return this.http.put<any>( API_CONFIG.baseURL+'/linhasprodutos/' + linhaProdutoDTO.id
                             , linhaProdutoDTO
                             , { observe: 'response' });

  }


  findAll() : Observable<LinhaProdutoDTO[]> {

    return this.http.get<LinhaProdutoDTO[]>( API_CONFIG.baseURL+'/linhasprodutos');

  }

  findByFilter(nome: string, idSubcategoria: number, idFabricante: number) : Observable<LinhaProdutoDTO[]> {

    let url: string = API_CONFIG.baseURL+'/linhasprodutos/filtro?';

    if(nome != null && nome.trim() != ''){
      url += 'nome='+nome;
    }

    if(idSubcategoria != null && idSubcategoria != 0){

      //verifica se adicionou o parâmetro nome
      if(url.indexOf('nome')>0){
        url += '&';
      }
      url += 'subcategoria='+idSubcategoria;
      
    }

    if(idFabricante != null && idFabricante != 0){

      //verifica se adicionou o parâmetro nome ou subcategoria
      if(url.indexOf('nome')>0 || url.indexOf('subcategoria')>0){
        url += '&';
      }
      url += 'fabricante='+idFabricante;
      
    }

    return this.http.get<LinhaProdutoDTO[]>( url );

  }

  delete(id: number) : Observable<void> {

    return this.http.delete<void>( `${API_CONFIG.baseURL}${'/linhasprodutos/'}${id}`);

  }

}
