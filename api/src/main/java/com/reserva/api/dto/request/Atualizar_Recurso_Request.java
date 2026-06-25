package com.reserva.api.dto.request;

import com.reserva.api.model.Status_Recurso;
import com.reserva.api.model.Tipo_Recurso;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record Atualizar_Recurso_Request(

        @NotBlank(message = "O nome é obrigatório")
        String nome,

        String descricao,

        @NotNull(message = "O tipo é obrigatório")
        Tipo_Recurso tipo,

        @Positive(message = "A capacidade deve ser maior que zero")
        Integer capacidade,

        @NotBlank(message = "A localização é obrigatória")
        String localizacao,

        @NotNull(message = "O status é obrigatório")
        Status_Recurso status

) {
}