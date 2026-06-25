package com.reserva.api.dto.response;

import com.reserva.api.model.Status_Reserva;

import java.time.LocalDateTime;

public record Reserva_Response(
        Long id,

        Long usuarioId,
        String usuarioNome,
        String usuarioEmail,

        Long recursoId,
        String recursoNome,

        LocalDateTime inicio,
        LocalDateTime fim,
        Integer quantidadeParticipantes,
        String justificativa,
        Status_Reserva status
) {
}