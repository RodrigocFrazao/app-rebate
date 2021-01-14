import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONFIG } from 'src/config/api.config';
import { ModeloDTO } from 'src/models/modeloDTO';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  constructor(private http: HttpClient){ 
  }

  insert(modeloDTO: ModeloDTO) : Observable<any> {

    return this.http.post<any>( API_CONFIG.baseURL+'/modelos'
                              , modeloDTO
                              , { observe: 'response' });

  }

  update(modeloDTO: ModeloDTO) : Observable<any> {

    console.log('modeloDTO: ' + modeloDTO);

    return this.http.put<any>( API_CONFIG.baseURL+'/modelos/' + modeloDTO.id
                             , modeloDTO
                             , { observe: 'response' });

  }


  findAll() : Observable<ModeloDTO[]> {

    return this.http.get<ModeloDTO[]>( API_CONFIG.baseURL+'/modelos');

  }

  findByFilter( nome: string
              , idLinhaProduto: number) : Observable<ModeloDTO[]> {

    
      let url: string = API_CONFIG.baseURL+'/modelos/filtro?';

      if(nome != null && nome.trim() != ''){
        url += 'nome='+nome;
      }

      
      if(idLinhaProduto != null && idLinhaProduto != 0){

        //verifica se adicionou o parâmetro nome ou subcategoria
        if(url.indexOf('nome')>0){
          url += '&';
        }
        url += 'linhaproduto='+idLinhaProduto;
      
      } 

      return this.http.get<ModeloDTO[]>( url );

  }

  delete(id: number) : Observable<void> {

    return this.http.delete<void>( `${API_CONFIG.baseURL}${'/modelos/'}${id}`);

  }

  

}
