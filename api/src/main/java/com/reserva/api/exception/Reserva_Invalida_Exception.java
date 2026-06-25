package com.reserva.api.exception;

public class Reserva_Invalida_Exception extends RuntimeException {

    public Reserva_Invalida_Exception(String mensagem) {
        super(mensagem);
    }
}