package com.utp.delivery.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 1. Maneja validaciones lógicas (Ej: Contraseña vacía, correo inválido)
    // Devuelve 400 BAD REQUEST
    @ExceptionHandler({IllegalArgumentException.class, RuntimeException.class})
    public ResponseEntity<Map<String, String>> handleValidationExceptions(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 2. Maneja duplicados de Base de Datos (Ej: Correo repetido)
    // Devuelve 409 CONFLICT (El estándar para duplicados)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Error: El correo electrónico ya está registrado en el sistema.");
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
}