package com.reserva.api.exception;

public class Usuario_Nao_Encontrado_Exception extends RuntimeException {

    public Usuario_Nao_Encontrado_Exception(String email) {
        super("Usuário não encontrado com o e-mail: " + email);
    }
}