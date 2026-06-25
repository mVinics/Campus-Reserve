package com.reserva.api.controller;

import com.reserva.api.dto.response.Token_Response;
import com.reserva.api.service.Token_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class Auth_Controller {

    private final Token_Service tokenService;

    @PostMapping("/token")
    public ResponseEntity<Token_Response> gerarToken(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                tokenService.gerarToken(authentication)
        );
    }
}