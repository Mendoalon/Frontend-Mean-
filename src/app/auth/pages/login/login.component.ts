import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

//Impotamos de sweetalert2
import Swal   from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent   {

  miFormulario: FormGroup = this.fb.group({
    email: ['test1@test.com', [Validators.required, Validators.email]],
    password: ['Mendoza', [Validators.required, Validators.minLength(6)]]
  })

  constructor(  private fb: FormBuilder, 
                private router: Router ,
                private authService: AuthService ) { }

  login(){
    const { email, password } = this.miFormulario.value;

    this.authService.login(email, password)
     .subscribe( ok =>{
      console.log(ok);
      
      if( ok === true ){
        
        //Si el usuario y la contraseña son correctas, envia al la ruta: dashboard
        this.router.navigateByUrl('/dashboard');
      }else{
        //Si el login o contraseña no es valida, genramos pantalla con mensaje del error
        Swal.fire('error', ok, 'error');
      }
      
     })
  
}

}