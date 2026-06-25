package com.reserva.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestControllerAdvice
public class Global_Exception_Handler {

    @ExceptionHandler(Recurso_Nao_Encontrado_Exception.class)
    public ResponseEntity<ProblemDetail> tratarRecursoNaoEncontrado(
            Recurso_Nao_Encontrado_Exception exception
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );

        problema.setTitle("Recurso não encontrado");

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(problema);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> tratarErroDeValidacao(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> erros = exception
                .getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        erro -> erro.getField(),
                        erro -> Optional.ofNullable(erro.getDefaultMessage())
                                .orElse("Valor inválido"),
                        (primeiroErro, segundoErro) -> primeiroErro,
                        LinkedHashMap::new
                ));

        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Um ou mais campos enviados são inválidos."
        );

        problema.setTitle("Erro de validação");
        problema.setProperty("erros", erros);

        return ResponseEntity
                .badRequest()
                .body(problema);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ProblemDetail> tratarJsonInvalido(
            HttpMessageNotReadableException exception
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "O corpo da requisição está inválido ou possui valores incompatíveis."
        );

        problema.setTitle("Requisição inválida");

        return ResponseEntity
                .badRequest()
                .body(problema);
    }

    //e-mail duplicado
    @ExceptionHandler(Email_Ja_Cadastrado_Exception.class)
    public ResponseEntity<ProblemDetail> tratarEmailJaCadastrado(
            Email_Ja_Cadastrado_Exception exception
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );

        problema.setTitle("E-mail já cadastrado");

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(problema);
    }

    @ExceptionHandler(Reserva_Invalida_Exception.class)
    public ResponseEntity<ProblemDetail> tratarReservaInvalida(
            Reserva_Invalida_Exception exception
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNPROCESSABLE_ENTITY,
                exception.getMessage()
        );

        problema.setTitle("Reserva inválida");

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(problema);
    }

    @ExceptionHandler(Conflito_Reserva_Exception.class)
    public ResponseEntity<ProblemDetail> tratarConflitoDeReserva(
            Conflito_Reserva_Exception exception
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );

        problema.setTitle("Conflito de horário");

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(problema);
    }

    @ExceptionHandler(Usuario_Nao_Encontrado_Exception.class)
    public ResponseEntity<ProblemDetail> tratarUsuarioNaoEncontrado(
            Usuario_Nao_Encontrado_Exception exception
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );

        problema.setTitle("Usuário não encontrado");

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(problema);
    }

    //Reserva nao encontrada
    @ExceptionHandler(Reserva_Nao_Encontrada_Exception.class)
    public ResponseEntity<ProblemDetail> tratarReservaNaoEncontrada(
            Reserva_Nao_Encontrada_Exception exception
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );

        problema.setTitle("Reserva não encontrada");

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(problema);
    }

    //Reserva nao pertence ao usuario
    @ExceptionHandler(Reserva_Nao_Pertence_Ao_Usuario_Exception.class)
    public ResponseEntity<ProblemDetail> tratarReservaNaoPertenceAoUsuario(
            Reserva_Nao_Pertence_Ao_Usuario_Exception exception
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.FORBIDDEN,
                exception.getMessage()
        );

        problema.setTitle("Operação não permitida");

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(problema);
    }
}