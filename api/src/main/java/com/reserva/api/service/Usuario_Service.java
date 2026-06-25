package com.reserva.api.service;

import com.reserva.api.dto.request.Criar_Usuario_Request;
import com.reserva.api.dto.response.Usuario_Response;
import com.reserva.api.exception.Email_Ja_Cadastrado_Exception;
import com.reserva.api.model.Perfil_Usuario;
import com.reserva.api.model.Usuario;
import com.reserva.api.repository.Usuario_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class Usuario_Service {

    private final Usuario_Repository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario_Response cadastrar(
            Criar_Usuario_Request request
    ) {
        String emailNormalizado = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (
                usuarioRepository.existsByEmailIgnoreCase(
                        emailNormalizado
                )
        ) {
            throw new Email_Ja_Cadastrado_Exception(
                    emailNormalizado
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.nome().trim());
        usuario.setEmail(emailNormalizado);
        usuario.setSenha(
                passwordEncoder.encode(request.senha())
        );
        usuario.setPerfil(Perfil_Usuario.ALUNO);
        usuario.setAtivo(true);

        Usuario usuarioSalvo =
                usuarioRepository.save(usuario);

        return converterParaResponse(usuarioSalvo);
    }

    @Transactional(readOnly = true)
    public List<Usuario_Response> listarTodos() {
        return usuarioRepository
                .findAll(
                        Sort.by("nome").ascending()
                )
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    @Transactional
    public void excluir(
            Long id,
            String emailAdministrador
    ) {
        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuário não encontrado."
                        )
                );

        if (
                usuario.getEmail().equalsIgnoreCase(
                        emailAdministrador
                )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O administrador não pode excluir a própria conta."
            );
        }

        if (!usuario.isAtivo()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A conta já está desativada."
            );
        }

        usuario.setAtivo(false);

        usuarioRepository.save(usuario);
    }

    private Usuario_Response converterParaResponse(
            Usuario usuario
    ) {
        return new Usuario_Response(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.isAtivo()
        );
    }
}