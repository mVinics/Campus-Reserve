package com.reserva.api.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record Criar_Reserva_Request(

        @NotNull(message = "O recurso é obrigatório")
        Long recursoId,

        @NotNull(message = "A data e hora de início são obrigatórias")
        @Future(message = "O início da reserva deve estar no futuro")
        LocalDateTime inicio,

        @NotNull(message = "A data e hora de fim são obrigatórias")
        @Future(message = "O fim da reserva deve estar no futuro")
        LocalDateTime fim,

        @Positive(message = "A quantidade de participantes deve ser maior que zero")
        Integer quantidadeParticipantes,

        @Size(max = 500, message = "A justificativa deve possuir no máximo 500 caracteres")
        String justificativa

) {
}