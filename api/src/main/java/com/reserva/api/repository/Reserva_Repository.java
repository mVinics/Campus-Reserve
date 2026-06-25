package com.reserva.api.repository;

import com.reserva.api.model.Reserva;
import com.reserva.api.model.Status_Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface Reserva_Repository extends JpaRepository<Reserva, Long> {

    @Query("""
            SELECT COUNT(r)
            FROM Reserva r
            WHERE r.recurso.id = :recursoId
              AND r.status IN :status
              AND r.inicio < :fim
              AND r.fim > :inicio
            """)
    long contarConflitos(
            @Param("recursoId") Long recursoId,
            @Param("status") Collection<Status_Reserva> status,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    @Query("""
            SELECT r
            FROM Reserva r
            JOIN FETCH r.usuario
            JOIN FETCH r.recurso
            WHERE LOWER(r.usuario.email) = LOWER(:email)
            ORDER BY r.inicio DESC
            """)
    List<Reserva> buscarPorEmailUsuario(
            @Param("email") String email
    );

    @Query("""
            SELECT r
            FROM Reserva r
            JOIN FETCH r.usuario
            JOIN FETCH r.recurso
            ORDER BY r.inicio DESC
            """)
    List<Reserva> buscarTodas();
}