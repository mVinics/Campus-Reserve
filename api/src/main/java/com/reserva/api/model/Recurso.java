package com.reserva.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//primeira entidade

@Entity
@Table(name = "recursos")
@Getter
@Setter
@NoArgsConstructor

public class Recurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 500)
    private String descricao;

    //para o JPA armazenar o enum por nome
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Tipo_Recurso tipo;

    private Integer capacidade;

    @Column(nullable = false, length = 150)
    private String localizacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status_Recurso status;
}