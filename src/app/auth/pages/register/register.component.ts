import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

//Impotamos de sweetalert2
import Swal   from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent   {

  miFormulario: FormGroup = this.fb.group({
    name: ['Test 4', [ Validators.required] ],
    email: ['test1@test.com', [ Validators.required, Validators.email] ],
    password: ['Mendoza', [ Validators.required, Validators.minLength(6)] ]
  })

  constructor(  private fb: FormBuilder,
                private router: Router ,
                private authService: AuthService
                ) { }

  //Funcion para registrar usuario.               
  registro(){

    const { name, email, password } = this.miFormulario.value;

    this.authService.registro(name, email, password)
      .subscribe( ok =>{
        console.log(ok)
      
      if( ok === true ){
        //Si el correo  y la contraseña son correctas, envia al la ruta: dashboard
        this.router.navigateByUrl('/dashboard');
      }else{
        //Si ya existe un correo igual, genramos pantalla con mensaje del error
        Swal.fire('error', ok, 'error');
      }
    })  
    

  }
}
