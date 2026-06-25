package com.reserva.api.exception;

public class Conflito_Reserva_Exception extends RuntimeException {

    public Conflito_Reserva_Exception() {
        super("O recurso já possui uma reserva nesse período.");
    }
}