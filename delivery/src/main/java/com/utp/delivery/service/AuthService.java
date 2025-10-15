package com.utp.delivery.service;

import com.utp.delivery.dto.AuthResponse;
import com.utp.delivery.dto.LoginRequest;
import com.utp.delivery.dto.RegisterRequest;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.repository.UsuarioRepository;
import com.utp.delivery.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        var user = new Usuario();
        user.setNombreCompleto(request.getNombreCompleto());
        user.setCorreo(request.getCorreo());
        user.setContrasena(passwordEncoder.encode(request.getContrasena()));
        user.setCodigoEstudiante(request.getCodigoEstudiante());
        user.setRol("CLIENTE");
        user.setActivo(true);
        user.setFechaRegistro(LocalDateTime.now());
        usuarioRepository.save(user);
        var jwtToken = jwtUtil.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getContrasena()));
        var user = usuarioRepository.findByCorreo(request.getCorreo()).orElseThrow();
        var jwtToken = jwtUtil.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }
}