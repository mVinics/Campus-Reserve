package com.reserva.api.exception;

public class Email_Ja_Cadastrado_Exception extends RuntimeException {

    public Email_Ja_Cadastrado_Exception(String email) {
        super("Já existe um usuário cadastrado com o e-mail: " + email);
    }
}