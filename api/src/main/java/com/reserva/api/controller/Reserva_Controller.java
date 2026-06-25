package com.reserva.api.controller;

import com.reserva.api.dto.request.Criar_Reserva_Request;
import com.reserva.api.dto.response.Reserva_Response;
import com.reserva.api.service.Reserva_Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class Reserva_Controller {

    private final Reserva_Service reservaService;

    @PostMapping
    public ResponseEntity<Reserva_Response> cadastrar(
            @Valid @RequestBody Criar_Reserva_Request request,
            Authentication authentication
    ) {
        Reserva_Response reserva = reservaService.cadastrar(
                request,
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reserva);
    }

    @GetMapping
    public ResponseEntity<List<Reserva_Response>> listarTodas() {
        return ResponseEntity.ok(
                reservaService.listarTodas()
        );
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<Reserva_Response>> listarMinhasReservas(
            Authentication authentication
    ) {
        List<Reserva_Response> reservas =
                reservaService.listarMinhasReservas(
                        authentication.getName()
                );

        return ResponseEntity.ok(reservas);
    }

    //endpoint cancelar
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Reserva_Response> cancelar(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Reserva_Response reserva = reservaService.cancelar(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok(reserva);
    }

    //endpoint aprovado/rejeitado
    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Reserva_Response> aprovar(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                reservaService.aprovar(id)
        );
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<Reserva_Response> rejeitar(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                reservaService.rejeitar(id)
        );
    }

    //reserva por ID
    @GetMapping("/{id}")
    public ResponseEntity<Reserva_Response> buscarPorId(
            @PathVariable Long id,
            Authentication authentication
    ) {
        boolean administrador = authentication
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);

        Reserva_Response reserva = reservaService.buscarPorId(
                id,
                authentication.getName(),
                administrador
        );

        return ResponseEntity.ok(reserva);
    }

}