package com.reserva.api.service;

import com.reserva.api.dto.request.Criar_Reserva_Request;
import com.reserva.api.dto.response.Reserva_Response;
import com.reserva.api.exception.Conflito_Reserva_Exception;
import com.reserva.api.exception.Recurso_Nao_Encontrado_Exception;
import com.reserva.api.exception.Reserva_Invalida_Exception;
import com.reserva.api.exception.Usuario_Nao_Encontrado_Exception;
import com.reserva.api.model.Recurso;
import com.reserva.api.model.Reserva;
import com.reserva.api.model.Status_Recurso;
import com.reserva.api.model.Status_Reserva;
import com.reserva.api.model.Usuario;
import com.reserva.api.repository.Recurso_Repository;
import com.reserva.api.repository.Reserva_Repository;
import com.reserva.api.repository.Usuario_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.reserva.api.exception.Reserva_Nao_Pertence_Ao_Usuario_Exception;
import com.reserva.api.exception.Reserva_Nao_Encontrada_Exception;

import java.util.List;
import java.time.LocalDateTime;



@Service
@RequiredArgsConstructor
public class Reserva_Service {

    private static final List<Status_Reserva> STATUS_QUE_BLOQUEIAM_HORARIO =
            List.of(
                    Status_Reserva.PENDENTE,
                    Status_Reserva.APROVADA
            );

    private final Reserva_Repository reservaRepository;
    private final Recurso_Repository recursoRepository;
    private final Usuario_Repository usuarioRepository;

    @Transactional
    public Reserva_Response cadastrar(
            Criar_Reserva_Request request,
            String emailUsuario
    ) {
        validarPeriodo(request);

        Usuario usuario = usuarioRepository
                .findByEmailIgnoreCase(emailUsuario)
                .orElseThrow(() ->
                        new Usuario_Nao_Encontrado_Exception(emailUsuario)
                );

        Recurso recurso = recursoRepository
                .findById(request.recursoId())
                .orElseThrow(() ->
                        new Recurso_Nao_Encontrado_Exception(
                                request.recursoId()
                        )
                );

        validarDisponibilidade(recurso);
        validarCapacidade(recurso, request.quantidadeParticipantes());
        validarConflito(recurso, request);

        Reserva reserva = new Reserva();

        reserva.setUsuario(usuario);
        reserva.setRecurso(recurso);
        reserva.setInicio(request.inicio());
        reserva.setFim(request.fim());
        reserva.setQuantidadeParticipantes(
                request.quantidadeParticipantes()
        );
        reserva.setJustificativa(
                normalizarJustificativa(request.justificativa())
        );
        reserva.setStatus(Status_Reserva.PENDENTE);

        Reserva reservaSalva = reservaRepository.save(reserva);

        return converterParaResponse(reservaSalva);
    }

    private void validarPeriodo(Criar_Reserva_Request request) {
        if (!request.inicio().isBefore(request.fim())) {
            throw new Reserva_Invalida_Exception(
                    "A data e hora de início devem ser anteriores ao fim."
            );
        }
    }

    private void validarDisponibilidade(Recurso recurso) {
        if (recurso.getStatus() != Status_Recurso.DISPONIVEL) {
            throw new Reserva_Invalida_Exception(
                    "O recurso não está disponível para reserva."
            );
        }
    }

    private void validarCapacidade(
            Recurso recurso,
            Integer quantidadeParticipantes
    ) {
        Integer capacidade = recurso.getCapacidade();

        if (capacidade == null) {
            return;
        }

        if (quantidadeParticipantes == null) {
            throw new Reserva_Invalida_Exception(
                    "A quantidade de participantes é obrigatória " +
                            "para esse recurso."
            );
        }

        if (quantidadeParticipantes > capacidade) {
            throw new Reserva_Invalida_Exception(
                    "A quantidade de participantes excede a capacidade " +
                            "do recurso, que é de " + capacidade + " pessoas."
            );
        }
    }

    private void validarConflito(
            Recurso recurso,
            Criar_Reserva_Request request
    ) {
        long quantidadeConflitos = reservaRepository.contarConflitos(
                recurso.getId(),
                STATUS_QUE_BLOQUEIAM_HORARIO,
                request.inicio(),
                request.fim()
        );

        if (quantidadeConflitos > 0) {
            throw new Conflito_Reserva_Exception();
        }
    }

    private String normalizarJustificativa(String justificativa) {
        if (justificativa == null || justificativa.isBlank()) {
            return null;
        }

        return justificativa.trim();
    }

    private Reserva_Response converterParaResponse(Reserva reserva) {
        return new Reserva_Response(
                reserva.getId(),

                reserva.getUsuario().getId(),
                reserva.getUsuario().getNome(),
                reserva.getUsuario().getEmail(),

                reserva.getRecurso().getId(),
                reserva.getRecurso().getNome(),

                reserva.getInicio(),
                reserva.getFim(),
                reserva.getQuantidadeParticipantes(),
                reserva.getJustificativa(),
                reserva.getStatus()
        );
    }

    @Transactional(readOnly = true)
    public List<Reserva_Response> listarMinhasReservas(
            String emailUsuario
    ) {
        return reservaRepository
                .buscarPorEmailUsuario(emailUsuario)
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    /// cancelamento ////

    private void validarProprietario(
            Reserva reserva,
            String emailUsuario
    ) {
        boolean pertenceAoUsuario = reserva
                .getUsuario()
                .getEmail()
                .equalsIgnoreCase(emailUsuario);

        if (!pertenceAoUsuario) {
            throw new Reserva_Nao_Pertence_Ao_Usuario_Exception();
        }
    }

    private void validarPossibilidadeDeCancelamento(Reserva reserva) {
        if (reserva.getStatus() != Status_Reserva.PENDENTE
                && reserva.getStatus() != Status_Reserva.APROVADA) {

            throw new Reserva_Invalida_Exception(
                    "A reserva não pode ser cancelada no status atual: "
                            + reserva.getStatus()
            );
        }

        if (!LocalDateTime.now().isBefore(reserva.getInicio())) {
            throw new Reserva_Invalida_Exception(
                    "Não é possível cancelar uma reserva que já começou."
            );
        }
    }

    @Transactional
    public Reserva_Response cancelar(
            Long reservaId,
            String emailUsuario
    ) {
        Reserva reserva = buscarReservaPorId(reservaId);

        validarProprietario(reserva, emailUsuario);
        validarPossibilidadeDeCancelamento(reserva);

        reserva.setStatus(Status_Reserva.CANCELADA);

        return converterParaResponse(reserva);
    }

    @Transactional(readOnly = true)
    public List<Reserva_Response> listarTodas() {
        return reservaRepository.buscarTodas()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    /// aprovado/rejeitado ///

    private Reserva buscarReservaPorId(Long reservaId) {
        return reservaRepository.findById(reservaId)
                .orElseThrow(() ->
                        new Reserva_Nao_Encontrada_Exception(reservaId)
                );
    }

    private void validarReservaPendente(Reserva reserva) {
        if (reserva.getStatus() != Status_Reserva.PENDENTE) {
            throw new Reserva_Invalida_Exception(
                    "A reserva não pode ser alterada porque seu status atual é: "
                            + reserva.getStatus()
            );
        }
    }

    @Transactional
    public Reserva_Response aprovar(Long reservaId) {
        Reserva reserva = buscarReservaPorId(reservaId);

        validarReservaPendente(reserva);

        reserva.setStatus(Status_Reserva.APROVADA);

        return converterParaResponse(reserva);
    }

    @Transactional
    public Reserva_Response rejeitar(Long reservaId) {
        Reserva reserva = buscarReservaPorId(reservaId);

        validarReservaPendente(reserva);

        reserva.setStatus(Status_Reserva.REJEITADA);

        return converterParaResponse(reserva);
    }

    /// reserva por ID ///

    @Transactional(readOnly = true)
    public Reserva_Response buscarPorId(
            Long reservaId,
            String emailUsuario,
            boolean administrador
    ) {
        Reserva reserva = buscarReservaPorId(reservaId);

        if (!administrador) {
            validarProprietario(reserva, emailUsuario);
        }

        return converterParaResponse(reserva);
    }
}