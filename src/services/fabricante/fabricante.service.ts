import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONFIG } from 'src/config/api.config';
import { FabricanteDTO } from 'src/models/fabricanteDTO';

@Injectable({
  providedIn: 'root'
})
export class FabricanteService {

  constructor(private http: HttpClient){ 
  }

  insert(fabricanteDTO: FabricanteDTO) : Observable<any> {

    return this.http.post<any>( API_CONFIG.baseURL+'/fabricantes'
                              , fabricanteDTO
                              , { observe: 'response' });

  }

  update(fabricanteDTO: FabricanteDTO) : Observable<any> {

    console.log('fabricanteDTO: ' + fabricanteDTO);

    return this.http.put<any>( API_CONFIG.baseURL+'/fabricantes/' + fabricanteDTO.id
                             , fabricanteDTO
                             , { observe: 'response' });

  }


  findAll() : Observable<FabricanteDTO[]> {

    return this.http.get<FabricanteDTO[]>( API_CONFIG.baseURL+'/fabricantes');

  }

  findByFilter(nome: string) : Observable<FabricanteDTO[]> {

    return this.http.get<FabricanteDTO[]>( API_CONFIG.baseURL+'/fabricantes/filtro?nome='+nome);

  }

  delete(id: number) : Observable<void> {

    return this.http.delete<void>( `${API_CONFIG.baseURL}${'/fabricantes/'}${id}`);

  }

}
