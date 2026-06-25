package com.reserva.api.controller;

import com.reserva.api.dto.request.Criar_Recurso_Request;
import com.reserva.api.dto.response.Recurso_Response;
import com.reserva.api.service.Recurso_Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.reserva.api.dto.request.Atualizar_Recurso_Request;

import java.util.List;

@RestController
@RequestMapping("/api/recursos")
@RequiredArgsConstructor
public class Recurso_Controller {

    private final Recurso_Service recursoService;

    @PostMapping
    public ResponseEntity<Recurso_Response> cadastrar(
            @Valid @RequestBody Criar_Recurso_Request request
    ) {
        Recurso_Response recurso = recursoService.cadastrar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(recurso);
    }

    @GetMapping
    public ResponseEntity<List<Recurso_Response>> listarTodos() {
        return ResponseEntity.ok(recursoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recurso_Response> buscarPorId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(recursoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recurso_Response> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Atualizar_Recurso_Request request
    ) {
        return ResponseEntity.ok(
                recursoService.atualizar(id, request)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        recursoService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}