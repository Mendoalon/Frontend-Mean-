import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;

  private _usuario!: Usuario; 

  get usuario(){
    return { ...this._usuario };
  }

  constructor( private htpp: HttpClient) { }

  //Funcion de http para registro de usuario
  registro(name: string, email: string, password: string){
    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password };

    return this.htpp.post<AuthResponse>( url, body )
    .pipe(
      tap( ({ ok, token }) =>{
        if( ok ){
          localStorage.setItem('token', token!);
        }
      }),
       map( ({ok}) => ok ),
       catchError( err => of( err.error.msg) )
     );
  }


  //Peticion para el login
  login(email: string, password: string){
    const url = `${this.baseUrl}/auth`;
    const body = { email, password};
    
   return this.htpp.post<AuthResponse>( url, body )
   .pipe(
    tap( ({ok, token}) =>{
      if(ok){
        localStorage.setItem('token', token!);
      }
    }),
     map( resp => resp.ok),
     catchError( err => of( err.error.msg) )
   );

  }

  //Para validar token y que el usuario le cargue su informacion.
  validarToken(): Observable<boolean>{
    const url = `${this.baseUrl}/auth/renew`;
    const header = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

     return this.htpp.get<AuthResponse>( url, { headers: header} )
            .pipe(
              map( resp =>{ 
                localStorage.setItem('token', resp.token!);
                  if(resp){
                    this._usuario = {
                      name: resp.name!,
                      uid: resp.uid!,
                      email: resp.email!
                    }
                  }
                return resp.ok 
              }),
              catchError( err => of( false) )

            )

  }


  //Borramos todo el localStorage.
  logout (){
    localStorage.clear();
  }




}
