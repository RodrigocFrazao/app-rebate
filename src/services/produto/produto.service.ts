import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONFIG } from 'src/config/api.config';
import { ProdutoDTO } from 'src/models/produtoDTO';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private http: HttpClient){ 
  }

  insert(produtoDTO: ProdutoDTO) : Observable<any> {

    return this.http.post<any>( API_CONFIG.baseURL+'/produtos'
                              , produtoDTO
                              , { observe: 'response' });

  }

  update(produtoDTO: ProdutoDTO) : Observable<any> {

    console.log('produtoDTO: ' + produtoDTO);

    return this.http.put<any>( API_CONFIG.baseURL+'/produtos/' + produtoDTO.id
                             , produtoDTO
                             , { observe: 'response' });

  }


  findAll() : Observable<ProdutoDTO[]> {

    return this.http.get<ProdutoDTO[]>( API_CONFIG.baseURL+'/produtos');

  }

  find(id: number) : Observable<ProdutoDTO> {

    return this.http.get<ProdutoDTO>( API_CONFIG.baseURL+'/produtos/' + id);

  }

  findByFilter(nome: string) : Observable<ProdutoDTO[]> {

    return this.http.get<ProdutoDTO[]>( API_CONFIG.baseURL+'/produtos/filtro?nome='+nome);

  }

  delete(id: number) : Observable<void> {

    return this.http.delete<void>( `${API_CONFIG.baseURL}${'/produtos/'}${id}`);

  }

}
