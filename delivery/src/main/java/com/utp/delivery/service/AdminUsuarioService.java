package com.utp.delivery.service;

import com.utp.delivery.model.Usuario;
import com.utp.delivery.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Transactional
    public Usuario crearUsuario(Usuario usuario) {
        // 1. VALIDACIÓN OBLIGATORIA: Evita que el servidor explote si no hay contraseña
        if (usuario.getContrasena() == null || usuario.getContrasena().trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria para nuevos usuarios.");
        }

        // 2. Limpieza y validación previa de correo
        String correoLimpio = usuario.getCorreo().trim();
        if (usuarioRepository.findByCorreoIgnoreCase(correoLimpio).isPresent()) {
            throw new IllegalArgumentException("El correo " + correoLimpio + " ya está registrado.");
        }

        // 3. Preparación de datos
        usuario.setCorreo(correoLimpio);
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena())); // Ahora es seguro encriptar
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setActivo(true);

        // Rol por defecto
        if (usuario.getRol() == null || usuario.getRol().isEmpty()) {
            usuario.setRol("CLIENTE");
        }

        // 4. saveAndFlush: Clave para que salte el error de duplicado en el momento exacto
        return usuarioRepository.saveAndFlush(usuario);
    }

    @Transactional
    public Usuario actualizarUsuario(Long id, Usuario detalles) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombreCompleto(detalles.getNombreCompleto());
        usuario.setRol(detalles.getRol());
        usuario.setCodigoEstudiante(detalles.getCodigoEstudiante());

        // Solo encriptamos si viene una nueva contraseña
        if (detalles.getContrasena() != null && !detalles.getContrasena().trim().isEmpty()) {
            usuario.setContrasena(passwordEncoder.encode(detalles.getContrasena()));
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario cambiarEstadoBloqueo(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(!usuario.isActivo());
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerEstadisticas() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", usuarios.size());
        stats.put("activos", usuarios.stream().filter(Usuario::isActivo).count());
        stats.put("inactivos", usuarios.stream().filter(u -> !u.isActivo()).count());
        stats.put("admin", usuarios.stream().filter(u -> "ADMINISTRADOR".equals(u.getRol())).count());
        stats.put("clientes", usuarios.stream().filter(u -> "CLIENTE".equals(u.getRol())).count());

        return stats;
    }
}