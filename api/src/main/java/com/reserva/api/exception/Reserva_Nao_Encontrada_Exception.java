package com.reserva.api.exception;

public class Reserva_Nao_Encontrada_Exception extends RuntimeException {

    public Reserva_Nao_Encontrada_Exception(Long id) {
        super("Reserva não encontrada com o ID: " + id);
    }
}