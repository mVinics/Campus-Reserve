package com.reserva.api.dto.response;

import com.reserva.api.model.Perfil_Usuario;

public record Usuario_Response(
        Long id,
        String nome,
        String email,
        Perfil_Usuario perfil,
        boolean ativo
) {
}