import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONFIG } from 'src/config/api.config';
import { SubcategoriaDTO } from 'src/models/subcategoriaDTO';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {

  constructor(private http: HttpClient){ 
  }

  insert(subcategoriaDTO: SubcategoriaDTO) : Observable<any> {

    return this.http.post<any>( API_CONFIG.baseURL+'/subcategorias'
                              , subcategoriaDTO
                              , { observe: 'response' });

  }

  update(subcategoriaDTO: SubcategoriaDTO) : Observable<any> {

    console.log('subcategoriaDTO: ' + subcategoriaDTO);

    return this.http.put<any>( API_CONFIG.baseURL+'/subcategorias/' + subcategoriaDTO.id
                             , subcategoriaDTO
                             , { observe: 'response' });

  }


  findAll() : Observable<SubcategoriaDTO[]> {

    return this.http.get<SubcategoriaDTO[]>( API_CONFIG.baseURL+'/subcategorias');

  }

  findByFilter(nome: string) : Observable<SubcategoriaDTO[]> {

    return this.http.get<SubcategoriaDTO[]>( API_CONFIG.baseURL+'/subcategorias/filtro?nome='+nome);

  }

  delete(id: number) : Observable<void> {

    return this.http.delete<void>( `${API_CONFIG.baseURL}${'/subcategorias/'}${id}`);

  }

}
