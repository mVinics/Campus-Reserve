package com.reserva.api.exception;

public class Reserva_Nao_Pertence_Ao_Usuario_Exception extends RuntimeException {

    public Reserva_Nao_Pertence_Ao_Usuario_Exception() {
        super("O usuário autenticado não possui permissão para alterar esta reserva.");
    }
}