package com.utp.delivery.controller;

import com.utp.delivery.dto.AuthResponse;
import com.utp.delivery.dto.LoginRequest;
import com.utp.delivery.dto.RegisterRequest;
import com.utp.delivery.dto.UserProfileResponse;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.repository.UsuarioRepository; 
import com.utp.delivery.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    private final AuthService authService;
    private final UsuarioRepository usuarioRepository; 

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> obtenerPerfil() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String correo = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        

        String rolString = (usuario.getRol() != null) ? usuario.getRol().toString() : "CLIENTE";

        UserProfileResponse response = UserProfileResponse.builder()
                .id(usuario.getId())
                .nombreCompleto(usuario.getNombreCompleto())
                .correo(usuario.getCorreo())
                .codigoEstudiante(usuario.getCodigoEstudiante())
                .rol(rolString)
                .build();

        return ResponseEntity.ok(response);
    }
}