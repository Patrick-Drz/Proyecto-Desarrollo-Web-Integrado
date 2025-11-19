package com.utp.delivery.controller;

import com.utp.delivery.dto.AuthResponse;
import com.utp.delivery.dto.LoginRequest;
import com.utp.delivery.dto.RegisterRequest;
import com.utp.delivery.dto.UserProfileResponse;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> obtenerPerfil(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        
        UserProfileResponse response = UserProfileResponse.builder()
                .id(usuario.getId())
                .nombreCompleto(usuario.getNombreCompleto())
                .correo(usuario.getCorreo())
                .codigoEstudiante(usuario.getCodigoEstudiante())
                .rol(usuario.getRol())
                .build();

        return ResponseEntity.ok(response);
    }
}