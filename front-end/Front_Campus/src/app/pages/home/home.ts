import { Component, OnInit } from '@angular/core';

import { Recurso } from '../../models/recurso';
import { RecursoService } from '../../services/recurso';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  recursos: Recurso[] = [];

  carregando = true;
  mensagemErro = '';

  constructor(
    private recursoService: RecursoService
  ) {}

  ngOnInit(): void {
    this.carregarRecursos();
  }

  carregarRecursos(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.recursoService.listar().subscribe({
      next: (recursos) => {
        this.recursos = recursos;
        this.carregando = false;
      },

      error: (erro) => {
        console.error('Erro ao carregar recursos:', erro);

        this.mensagemErro =
          'Não foi possível carregar as salas e laboratórios.';

        this.carregando = false;
      }
    });
  }
}