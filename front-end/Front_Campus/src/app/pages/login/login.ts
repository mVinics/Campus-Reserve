import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  formularioLogin;

  carregando = false;
  mensagemErro = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.formularioLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  entrar() {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const email = this.formularioLogin.value.email!;
    const senha = this.formularioLogin.value.senha!;

    this.carregando = true;
    this.mensagemErro = '';

    this.authService.login(email, senha).subscribe({
      next: (resposta) => {
        sessionStorage.setItem('accessToken', resposta.accessToken);

        // console.log('Login realizado com sucesso');
        // console.log('Token:', resposta.accessToken);

        this.carregando = false;

        this.router.navigate(['/home']);

      },

      error: (erro) => {
        console.error('Erro no login:', erro);

        if (erro.status === 401) {
          this.mensagemErro = 'E-mail ou senha inválidos.';
        } else {
          this.mensagemErro = 'Não foi possível entrar no sistema.';
        }

        this.carregando = false;
      }
    });
  }
}