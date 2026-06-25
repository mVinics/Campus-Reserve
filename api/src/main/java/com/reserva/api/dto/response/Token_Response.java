package com.reserva.api.dto.response;

public record Token_Response(
        String accessToken,
        String tokenType,
        long expiresIn
) {
}