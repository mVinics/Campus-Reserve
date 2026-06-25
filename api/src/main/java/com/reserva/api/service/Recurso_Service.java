package com.reserva.api.service;

import com.reserva.api.dto.request.Criar_Recurso_Request;
import com.reserva.api.dto.response.Recurso_Response;
import com.reserva.api.model.Recurso;
import com.reserva.api.repository.Recurso_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.reserva.api.exception.Recurso_Nao_Encontrado_Exception;
import java.util.List;
import com.reserva.api.dto.request.Atualizar_Recurso_Request;

@Service
@RequiredArgsConstructor
public class Recurso_Service {

    private final Recurso_Repository recursoRepository;

    @Transactional
    public Recurso_Response cadastrar(Criar_Recurso_Request request) {
        Recurso recurso = new Recurso();

        recurso.setNome(request.nome());
        recurso.setDescricao(request.descricao());
        recurso.setTipo(request.tipo());
        recurso.setCapacidade(request.capacidade());
        recurso.setLocalizacao(request.localizacao());
        recurso.setStatus(request.status());

        Recurso recursoSalvo = recursoRepository.save(recurso);

        return converterParaResponse(recursoSalvo);
    }

    @Transactional(readOnly = true)
    public List<Recurso_Response> listarTodos() {
        return recursoRepository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Recurso_Response buscarPorId(Long id) {
        Recurso recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new Recurso_Nao_Encontrado_Exception(id));

        return converterParaResponse(recurso);
    }

    @Transactional
    public Recurso_Response atualizar(
            Long id,
            Atualizar_Recurso_Request request
    ) {
        Recurso recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new Recurso_Nao_Encontrado_Exception(id));

        recurso.setNome(request.nome());
        recurso.setDescricao(request.descricao());
        recurso.setTipo(request.tipo());
        recurso.setCapacidade(request.capacidade());
        recurso.setLocalizacao(request.localizacao());
        recurso.setStatus(request.status());

        Recurso recursoAtualizado = recursoRepository.save(recurso);

        return converterParaResponse(recursoAtualizado);
    }

    //verifica se o recurso existe
    @Transactional
    public void excluir(Long id) {
        Recurso recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new Recurso_Nao_Encontrado_Exception(id));

        recursoRepository.delete(recurso);
    }

    private Recurso_Response converterParaResponse(Recurso recurso) {
        return new Recurso_Response(
                recurso.getId(),
                recurso.getNome(),
                recurso.getDescricao(),
                recurso.getTipo(),
                recurso.getCapacidade(),
                recurso.getLocalizacao(),
                recurso.getStatus()
        );
    }
}