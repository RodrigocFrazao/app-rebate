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

  findByFilter(nome: string) : Observable<LinhaProdutoDTO[]> {

    return this.http.get<LinhaProdutoDTO[]>( API_CONFIG.baseURL+'/linhasprodutos/filtro?nome='+nome);

  }

  delete(id: number) : Observable<void> {

    return this.http.delete<void>( `${API_CONFIG.baseURL}${'/linhasprodutos/'}${id}`);

  }

}
