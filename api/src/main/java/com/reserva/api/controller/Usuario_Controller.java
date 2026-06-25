package com.reserva.api.controller;

import com.reserva.api.dto.request.Criar_Usuario_Request;
import com.reserva.api.dto.response.Usuario_Response;
import com.reserva.api.service.Usuario_Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class Usuario_Controller {

    private final Usuario_Service usuarioService;

    @PostMapping
    public ResponseEntity<Usuario_Response> cadastrar(
            @Valid @RequestBody Criar_Usuario_Request request
    ) {
        Usuario_Response usuario =
                usuarioService.cadastrar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(usuario);
    }

    @GetMapping
    public ResponseEntity<List<Usuario_Response>> listarTodos() {
        return ResponseEntity.ok(
                usuarioService.listarTodos()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id,
            Authentication authentication
    ) {
        usuarioService.excluir(
                id,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}