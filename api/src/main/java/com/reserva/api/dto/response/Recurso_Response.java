package com.reserva.api.dto.response;

import com.reserva.api.model.Status_Recurso;
import com.reserva.api.model.Tipo_Recurso;

//o response representa o JSON devolvido
public record Recurso_Response(
        Long id,
        String nome,
        String descricao,
        Tipo_Recurso tipo,
        Integer capacidade,
        String localizacao,
        Status_Recurso status
) {
}