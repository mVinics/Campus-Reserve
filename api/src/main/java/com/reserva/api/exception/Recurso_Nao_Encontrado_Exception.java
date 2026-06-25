package com.reserva.api.exception;

public class Recurso_Nao_Encontrado_Exception extends RuntimeException {

    public Recurso_Nao_Encontrado_Exception(Long id) {
        super("Recurso não encontrado com o ID: " + id);
    }
}