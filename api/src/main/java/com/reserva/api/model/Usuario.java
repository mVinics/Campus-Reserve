package com.reserva.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//A senha será armazenada nessa entidade, mas nunca será devolvida no DTO de resposta.

@Entity
@Table(
        name = "usuarios",
        uniqueConstraints = {
                //faz o PostgreSQL impedir dois registros com o mesmo e-mail.
                @UniqueConstraint(
                        name = "uk_usuarios_email",
                        columnNames = "email"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Perfil_Usuario perfil;

    @Column(nullable = false)
    private boolean ativo;
}