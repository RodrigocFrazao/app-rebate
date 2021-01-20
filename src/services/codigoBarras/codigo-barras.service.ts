import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONFIG } from 'src/config/api.config';
import { CodigoBarrasDTO } from 'src/models/codigoBarrasDTO';

@Injectable({
  providedIn: 'root'
})
export class CodigoBarrasService {

  constructor(private http: HttpClient){ 
  }

  insert(codigoBarrasDTO: CodigoBarrasDTO) : Observable<any> {

    return this.http.post<any>( API_CONFIG.baseURL+'/codigosbarras'
                              , codigoBarrasDTO
                              , { observe: 'response' });

  }

  update(codigoBarrasDTO: CodigoBarrasDTO) : Observable<any> {

    console.log('codigoBarrasDTO: ' + codigoBarrasDTO);

    return this.http.put<any>( API_CONFIG.baseURL+'/codigosbarras/' + codigoBarrasDTO.id
                             , codigoBarrasDTO
                             , { observe: 'response' });

  }


  findAll() : Observable<CodigoBarrasDTO[]> {

    return this.http.get<CodigoBarrasDTO[]>( API_CONFIG.baseURL+'/codigosbarras');

  }

  /*findByFilter(nome: string) : Observable<CodigoBarrasDTO[]> {

    return this.http.get<CodigoBarrasDTO[]>( API_CONFIG.baseURL+'/codigosbarras/filtro?nome='+nome);

  }*/

  delete(id: number) : Observable<void> {

    return this.http.delete<void>( `${API_CONFIG.baseURL}${'/codigosbarras/'}${id}`);

  }

}
