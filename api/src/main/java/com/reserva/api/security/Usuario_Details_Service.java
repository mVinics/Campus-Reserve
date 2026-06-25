package com.reserva.api.security;

import com.reserva.api.model.Usuario;
import com.reserva.api.repository.Usuario_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class Usuario_Details_Service implements UserDetailsService {

    private final Usuario_Repository usuarioRepository;

    //é chamado automaticamente pelo Spring Security quando alguém envia credenciais
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        //consulta o postgre
        Usuario usuario = usuarioRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuário não encontrado"
                        )
                );

        //transforma a entidade em obj que o spring security entenda
        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha())
                .roles(usuario.getPerfil().name())
                //faz com que o usuario não consiga se autenticar
                .disabled(!usuario.isAtivo())
                .build();
    }
}