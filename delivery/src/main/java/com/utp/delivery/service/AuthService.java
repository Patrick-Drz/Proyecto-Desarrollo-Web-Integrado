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
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        String codigo = request.getCodigoEstudiante().trim().toLowerCase();
        String correo = request.getCorreo().trim().toLowerCase();

        if (!correo.endsWith("@utp.edu.pe")) {
            throw new IllegalArgumentException("Debes usar tu correo institucional (@utp.edu.pe)");
        }

        String prefix = correo.substring(0, correo.indexOf("@"));
        if (!prefix.equals(codigo)) {
            throw new IllegalArgumentException("El correo debe coincidir con el código (Ej: " + codigo + "@utp.edu.pe)");
        }

        Usuario user = new Usuario();
        user.setNombreCompleto(request.getNombreCompleto());
        user.setCorreo(request.getCorreo().trim());
        user.setContrasena(passwordEncoder.encode(request.getContrasena())); 
        user.setCodigoEstudiante(request.getCodigoEstudiante());
        user.setRol("CLIENTE"); 
        user.setActivo(true);
        user.setFechaRegistro(LocalDateTime.now());
        
        usuarioRepository.save(user);
        
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRol());
        extraClaims.put("nombre", user.getNombreCompleto());
        
        String jwtToken = jwtUtil.generateToken(extraClaims, user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getContrasena())
        );
        
        Usuario user = usuarioRepository.findByCorreoIgnoreCase(request.getCorreo().trim())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRol());
        extraClaims.put("nombre", user.getNombreCompleto());
        
        String jwtToken = jwtUtil.generateToken(extraClaims, user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    public String generarTokenRecuperacion(String correo) {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new RuntimeException("El correo no se encuentra registrado."));

        String token = UUID.randomUUID().toString();
        usuario.setTokenRecuperacion(token);
        usuario.setTokenExpiracion(LocalDateTime.now().plusMinutes(15)); 
        usuarioRepository.save(usuario);
        
        return token;
    }

    public void cambiarContrasenaConToken(String token, String nuevaContrasena) {
        Usuario usuario = usuarioRepository.findByTokenRecuperacion(token)
                .orElseThrow(() -> new RuntimeException("El enlace de recuperación no es válido."));

        if (usuario.getTokenExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El enlace ha caducado. Por favor solicita uno nuevo.");
        }

        if (passwordEncoder.matches(nuevaContrasena, usuario.getContrasena())) {
            throw new RuntimeException("Por seguridad, no puedes usar la misma contraseña anterior.");
        }

        usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
        usuario.setTokenRecuperacion(null);
        usuario.setTokenExpiracion(null);
        usuarioRepository.save(usuario);
    }
}