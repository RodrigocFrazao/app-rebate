import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONFIG } from 'src/config/api.config';
import { UsuarioDTO } from 'src/models/usuarioDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient){ 
  }

  insert(usuarioDTO: UsuarioDTO) : Observable<any> {

    return this.http.post<any>( API_CONFIG.baseURL+'/usuarios'
                              , usuarioDTO
                              , { observe: 'response' });

  }

  update(usuarioDTO: UsuarioDTO) : Observable<any> {

    return this.http.put<any>( API_CONFIG.baseURL+'/usuarios/' + usuarioDTO.id
                             , usuarioDTO
                             , { observe: 'response' });

  }


  findAll() : Observable<UsuarioDTO[]> {

    return this.http.get<UsuarioDTO[]>( API_CONFIG.baseURL+'/usuarios');

  }

  find(id: number) : Observable<UsuarioDTO> {

    return this.http.get<UsuarioDTO>( API_CONFIG.baseURL+'/usuarios/' + id);

  }

  findByFilter(nome: string) : Observable<UsuarioDTO[]> {

    return this.http.get<UsuarioDTO[]>( API_CONFIG.baseURL+'/usuarios/filtro?nome='+nome+'&login='+nome);

  }

  delete(id: number) : Observable<void> {

    return this.http.delete<void>( `${API_CONFIG.baseURL}${'/usuarios/'}${id}`);

  }

  changePassword(id: number, oldPassword: string, newPassword: string){
    
    return this.http.put<any>( API_CONFIG.baseURL+'/usuarios/alterarSenha?idUsuario='+id+'&senhaAntiga='+oldPassword+'&novaSenha='+newPassword
                             , { observe: 'response' });

  }

}
