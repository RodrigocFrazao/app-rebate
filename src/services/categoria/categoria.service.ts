import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONFIG } from 'src/config/api.config';
import { CategoriaDTO } from 'src/models/categoriaDTO';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient){ 
  }

  insert(categoriaDTO: CategoriaDTO) : Observable<any> {

    return this.http.post<any>( API_CONFIG.baseURL+'/categorias'
                              , categoriaDTO
                              , { observe: 'response' });

  }

  update(categoriaDTO: CategoriaDTO) : Observable<any> {

    console.log('categoriaDTO: ' + categoriaDTO);

    return this.http.put<any>( API_CONFIG.baseURL+'/categorias/' + categoriaDTO.id
                             , categoriaDTO
                             , { observe: 'response' });

  }


  findAll() : Observable<CategoriaDTO[]> {

    return this.http.get<CategoriaDTO[]>( API_CONFIG.baseURL+'/categorias');

  }

  findByFilter(nome: string) : Observable<CategoriaDTO[]> {

    return this.http.get<CategoriaDTO[]>( API_CONFIG.baseURL+'/categorias/filtro?nome='+nome);

  }

  delete(id: number) : Observable<void> {

    return this.http.delete<void>( `${API_CONFIG.baseURL}${'/categorias/'}${id}`);

  }

}
