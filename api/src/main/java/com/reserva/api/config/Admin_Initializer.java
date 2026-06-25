package com.reserva.api.config;

import com.reserva.api.model.Perfil_Usuario;
import com.reserva.api.model.Usuario;
import com.reserva.api.repository.Usuario_Repository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(
        prefix = "app.initial-admin",
        name = "enabled",
        havingValue = "true"
)

public class Admin_Initializer implements ApplicationRunner {

    private final Usuario_Repository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.initial-admin.name}")
    private String nome;

    @Value("${app.initial-admin.email}")
    private String email;

    @Value("${app.initial-admin.password}")
    private String senha;

    @Override
    public void run(ApplicationArguments args) {
        validarConfiguracao();

        String emailNormalizado = email
                .trim()
                .toLowerCase(Locale.ROOT);

        Usuario usuarioExistente = usuarioRepository
                .findByEmailIgnoreCase(emailNormalizado)
                .orElse(null);

        if (usuarioExistente != null) {
            if (usuarioExistente.getPerfil() == Perfil_Usuario.ADMIN) {
                log.info(
                        "Administrador inicial já cadastrado: {}",
                        emailNormalizado
                );
            } else {
                log.warn(
                        "O e-mail {} já está cadastrado, mas não possui perfil ADMIN.",
                        emailNormalizado
                );
            }

            return;
        }

        Usuario administrador = new Usuario();

        administrador.setNome(nome.trim());
        administrador.setEmail(emailNormalizado);
        administrador.setSenha(passwordEncoder.encode(senha));
        administrador.setPerfil(Perfil_Usuario.ADMIN);
        administrador.setAtivo(true);

        usuarioRepository.save(administrador);

        log.info(
                "Administrador inicial criado com o e-mail: {}",
                emailNormalizado
        );
    }

    private void validarConfiguracao() {
        if (nome == null || nome.isBlank()) {
            throw new IllegalStateException(
                    "O nome do administrador inicial não foi informado."
            );
        }

        if (email == null || email.isBlank()) {
            throw new IllegalStateException(
                    "O e-mail do administrador inicial não foi informado."
            );
        }

        if (senha == null || senha.length() < 8) {
            throw new IllegalStateException(
                    "A senha do administrador inicial deve possuir pelo menos 8 caracteres."
            );
        }
    }
}